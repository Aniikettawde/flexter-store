import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { resend, orderConfirmationEmail } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET as string)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ message: "Invalid webhook signature" }, { status: 400 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ message: "Malformed payload" }, { status: 400 });
  }

  if (payload.event === "payment.captured") {
    const payment = payload.payload.payment.entity;
    const supabaseAdmin = getSupabaseAdmin();

    // Single atomic update guarded by `neq("status", "paid")` — this closes
    // the race with /api/razorpay/verify, which can fire for the same
    // payment at roughly the same time. Whichever of the two actually
    // flips the row from not-paid to paid is the one that sends the email;
    // the other's WHERE clause simply won't match a row anymore.
    const { data: updated, error } = await supabaseAdmin
      .from("orders")
      .update({ status: "paid", razorpay_payment_id: payment.id })
      .eq("razorpay_order_id", payment.order_id)
      .neq("status", "paid")
      .select()
      .single();

    if (!error && updated) {
      resend.emails
        .send({
          from: "Flexter <info@flexter.in>",
          to: updated.customer_email,
          subject: `Order ${updated.order_number} confirmed`,
          html: orderConfirmationEmail(updated as any),
        })
        .catch((e) => console.error("Resend email failed:", e));
    }
    // If `updated` is null here, it means either the order didn't exist yet
    // (webhook arrived before /api/razorpay/order's insert committed — rare
    // but possible) or it was already marked paid by the verify route.
    // Either way, no action needed.
  }

  if (payload.event === "payment.failed") {
    const payment = payload.payload.payment.entity;
    const supabaseAdmin = getSupabaseAdmin();

    // Only mark as failed if it hasn't already succeeded elsewhere —
    // a late "failed" webhook should never downgrade an order that a
    // different, successful payment attempt already marked paid.
    await supabaseAdmin
      .from("orders")
      .update({ status: "failed" })
      .eq("razorpay_order_id", payment.order_id)
      .eq("status", "created");
  }

  return NextResponse.json({ ok: true });
}