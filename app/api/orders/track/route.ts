import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { order_number?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const orderNumber = body.order_number?.trim();
  const email = body.email?.trim();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Enter your order number and the email used at checkout." },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();
  // .ilike for case-insensitive email match; order_number is an exact,
  // system-generated value so eq is fine there.
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      "order_number, fulfillment_status, status, payment_method, items, amount, cod_charge, created_at"
    )
    .eq("order_number", orderNumber)
    .ilike("customer_email", email)
    .maybeSingle();

  if (error) {
    console.error("Track order lookup failed:", error);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }

  if (!order) {
    return NextResponse.json(
      { error: "No order found — check your order number and email." },
      { status: 404 }
    );
  }

  // Deliberately narrow: no address, phone, razorpay IDs, or internal id —
  // just what's needed to render the tracking view.
  return NextResponse.json({ order });
}