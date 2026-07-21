import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PRODUCT, SIZES } from "@/lib/product";

export const runtime = "nodejs";

type Item = { size: string; qty: number };
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
  try {
    const body = await req.json();
    const items: Item[] = body.items;
    const customer: Customer = body.customer;

    if (!items?.length) {
      return NextResponse.json({ message: "Your bag is empty." }, { status: 400 });
    }
    for (const item of items) {
      if (!SIZES.includes(item.size as any) || item.qty < 1) {
        return NextResponse.json({ message: "Invalid item in bag." }, { status: 400 });
      }
    }
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return NextResponse.json({ message: "Missing shipping details." }, { status: 400 });
    }

    // Recompute amount server-side. Never trust the client's total.
    const amountInPaise =
      items.reduce((sum, i) => sum + i.qty * PRODUCT.price, 0) * 100;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `flx_${Date.now()}`,
      notes: { brand: "Flexter" },
    });

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("orders").insert({
      razorpay_order_id: order.id,
      status: "created",
      amount: amountInPaise,
      currency: "INR",
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: {
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      },
      items: items.map((i) => ({ ...i, price: PRODUCT.price })),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      // Payment can still proceed even if logging fails; verification will
      // upsert the row again with the payment id.
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json(
      { message: "Couldn't create your order. Please try again." },
      { status: 500 }
    );
  }
}
