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

  const payload = JSON.parse(rawBody);

  if (payload.event === "payment.captured") {
    const payment = payload.payload.payment.entity;
    const supabaseAdmin = getSupabaseAdmin();

    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", payment.order_id)
      .single();

    // Only act if this order wasn't already marked paid (avoid duplicate emails)
    if (existing && existing.status !== "paid") {
      const { data: updated } = await supabaseAdmin
        .from("orders")
        .update({ status: "paid", razorpay_payment_id: payment.id })
        .eq("razorpay_order_id", payment.order_id)
        .select()
        .single();

      if (updated) {
        resend.emails
          .send({
            from: "Flexter <info@flexter.in>",
            to: updated.customer_email,
            subject: "Your Flexter order is confirmed",
            html: orderConfirmationEmail(updated as any),
          })
          .catch((e) => console.error("Resend email failed:", e));
      }
    }
  }

  return NextResponse.json({ ok: true });
}