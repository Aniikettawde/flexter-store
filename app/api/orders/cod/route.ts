import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { resend, orderConfirmationEmail } from "@/lib/resend";

// Keep this in sync with the check in CheckoutModal.tsx — client-side
// validation can always be bypassed, so re-check on the server too.
const isServiceablePincode = (pincode: string) => /^411\d{3}$/.test(pincode?.trim() ?? "");

type OrderItem = { size: string; qty: number; price: number };
type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export async function POST(req: Request) {
  let body: { items?: OrderItem[]; customer?: Customer; amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, customer, amount } = body;

  if (!items?.length || !customer) {
    return NextResponse.json({ error: "Missing order details" }, { status: 400 });
  }

  const { name, email, phone, address, city, state, pincode } = customer;
  if (!name || !email || !phone || !address || !city || !state || !pincode) {
    return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
  }

  if (!isServiceablePincode(pincode)) {
    return NextResponse.json(
      { error: "We only deliver within Pune (pincodes starting with 411)." },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();

  // razorpay_order_id is `unique not null` in the schema — COD orders don't
  // have a real Razorpay order, so we generate a synthetic-but-unique value
  // instead of requiring a schema migration to make the column nullable.
  const codOrderId = `cod_${randomUUID()}`;

  // Schema matches the same `orders` table the Razorpay webhook writes to
  // (see /admin) — razorpay_payment_id / razorpay_signature stay null for
  // COD orders since there's no payment gateway involved.
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      razorpay_order_id: codOrderId,
      items,
      // `amount` is stored in paise everywhere else in this schema
      // (Razorpay convention) — convert the rupee amount to match.
      amount: Math.round((amount ?? 0) * 100),
      payment_method: "cod",
      status: "cod_pending",
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      shipping_address: { address, city, state, pincode },
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create COD order:", error);
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }

  // Fire-and-forget — a failed email shouldn't fail an already-placed order.
  resend.emails
    .send({
      from: "Flexter <info@flexter.in>", // swap once your domain is verified
      to: data.customer_email,
      subject: "Your Flexter order is confirmed",
      html: orderConfirmationEmail(data as any),
    })
    .catch((e) => console.error("Resend email failed:", e));

  return NextResponse.json({ order: data }, { status: 201 });
}