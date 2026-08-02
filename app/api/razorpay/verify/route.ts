import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { resend, orderConfirmationEmail } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: "Missing payment details." }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    const supabaseAdmin = getSupabaseAdmin();
    const { data: updatedOrder, error } = await supabaseAdmin
      .from("orders")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: isValid ? "paid" : "failed",
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select()
      .single();

    if (!isValid) {
      return NextResponse.json({ message: "Signature mismatch." }, { status: 400 });
    }

    // Fire the confirmation email — don't block the response on it failing
    if (!error && updatedOrder) {
      resend.emails
        .send({
          from: "Flexter <info@flexter.in>", // swap once your domain is verified
          to: updatedOrder.customer_email,
          subject: `Order ${updatedOrder.order_number} confirmed`,
          html: orderConfirmationEmail(updatedOrder as any),
        })
        .catch((e) => console.error("Resend email failed:", e));
    }

    return NextResponse.json({
      ok: true,
      order_number: updatedOrder?.order_number ?? null,
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ message: "Verification failed." }, { status: 500 });
  }
}