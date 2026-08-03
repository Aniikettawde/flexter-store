import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { resend, orderConfirmationEmail } from "@/lib/resend";
import { PRODUCT, SIZES } from "@/lib/product";

// Keep this in sync with the check in CheckoutModal.tsx — client-side
// validation can always be bypassed, so re-check on the server too.
const isServiceablePincode = (pincode: string) => /^411\d{3}$/.test(pincode?.trim() ?? "");

// Flat COD handling charge in rupees — must match CheckoutModal.tsx.
const COD_CHARGE = 50;

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
  let body: { items?: OrderItem[]; customer?: Customer };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { items, customer } = body;
  if (!items?.length || !customer) {
    return NextResponse.json({ error: "Missing order details" }, { status: 400 });
  }
  for (const item of items) {
    if (!SIZES.includes(item.size as any) || item.qty < 1) {
      return NextResponse.json({ error: "Invalid item in bag" }, { status: 400 });
    }
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

  // Never trust client-side amount/price — recompute from PRODUCT.price
  // and add the flat COD charge, same pattern as /api/razorpay/order.
  const itemsAmount = items.reduce((sum, i) => sum + i.qty * PRODUCT.price, 0);
  const totalAmountRupees = itemsAmount + COD_CHARGE;
  const recomputedItems = items.map((i) => ({ size: i.size, qty: i.qty, price: PRODUCT.price }));

  const supabaseAdmin = getSupabaseAdmin();
  // razorpay_order_id is `unique not null` in the schema — COD orders don't
  // have a real Razorpay order, so we generate a synthetic-but-unique value
  // instead of requiring a schema migration to make the column nullable.
  const codOrderId = `cod_${randomUUID()}`;
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      razorpay_order_id: codOrderId,
      items: recomputedItems,
      cod_charge: COD_CHARGE * 100,
      // `amount` is stored in paise everywhere else in this schema
      // (Razorpay convention).
      amount: Math.round(totalAmountRupees * 100),
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