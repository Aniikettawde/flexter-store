import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import FulfillmentStatusControl from "@/components/admin/FulfillmentStatusControl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabaseAdmin = getSupabaseAdmin();

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) notFound();

  const address = order.shipping_address as {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  const items = order.items as { size: string; qty: number; price: number }[];

  const displayRef =
    order.order_number ??
    (order.payment_method === "cod"
      ? `COD-${order.id.slice(-8)}`
      : order.razorpay_order_id);

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-xs text-dim hover:text-paper">
        ← Back to orders
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl font-mono">
          Order {displayRef}
        </h1>
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            order.status === "paid"
              ? "bg-green-500/15 text-green-400"
              : order.status === "failed"
              ? "bg-red-500/15 text-red-400"
              : order.status === "cod_pending"
              ? "bg-blue-500/15 text-blue-400"
              : "bg-yellow-500/15 text-yellow-400"
          }`}
        >
          {order.status === "cod_pending" ? "COD pending" : order.status}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-strong rounded-2xl p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-dim">Customer</h2>
          <p className="text-sm">{order.customer_name}</p>
          <p className="text-sm text-dim">{order.customer_email}</p>
          <p className="text-sm text-dim">{order.customer_phone}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-dim">
            Shipping address
          </h2>
          <p className="text-sm">{address.address}</p>
          <p className="text-sm text-dim">
            {address.city}, {address.state} - {address.pincode}
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-dim">Items</h2>
          {items.map((i, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>Size {i.size} × {i.qty}</span>
              <span className="font-mono">
                ₹{(i.price * i.qty).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          <div className="border-t border-line pt-3 flex justify-between text-sm font-medium">
            <span>Total</span>
            <span className="font-mono">
              ₹{(order.amount / 100).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
		
		  <div className="glass-strong rounded-2xl p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-dim">Fulfillment</h2>
          <FulfillmentStatusControl
            orderId={order.id}
            currentStatus={order.fulfillment_status}
          />
        </div>

        <div className="glass-strong rounded-2xl p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-dim">Payment</h2>
          <p className="text-xs text-dim">
            Order number:{" "}
            <span className="font-mono text-paper">{order.order_number ?? "—"}</span>
          </p>
          <p className="text-xs text-dim">
            Method:{" "}
            <span className="font-mono text-paper">
              {order.payment_method === "cod" ? "Cash on delivery" : "Online (Razorpay)"}
            </span>
          </p>
          {order.payment_method === "cod" ? (
            <p className="text-xs text-dim">
              Collect{" "}
              <span className="font-mono text-paper">
                ₹{(order.amount / 100).toLocaleString("en-IN")}
              </span>{" "}
              in cash on delivery.
            </p>
          ) : (
            <>
              <p className="text-xs text-dim">
                Razorpay order ID:{" "}
                <span className="font-mono text-paper">{order.razorpay_order_id}</span>
              </p>
              <p className="text-xs text-dim">
                Payment ID:{" "}
                <span className="font-mono text-paper">
                  {order.razorpay_payment_id || "—"}
                </span>
              </p>
            </>
          )}
          <p className="text-xs text-dim">
            Created:{" "}
            {new Date(order.created_at).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}