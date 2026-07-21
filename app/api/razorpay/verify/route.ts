import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

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
    await supabaseAdmin
      .from("orders")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: isValid ? "paid" : "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id);

    if (!isValid) {
      return NextResponse.json({ message: "Signature mismatch." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ message: "Verification failed." }, { status: 500 });
  }
}
