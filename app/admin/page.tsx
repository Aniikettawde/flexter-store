import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-500/15 text-green-400",
  created: "bg-yellow-500/15 text-yellow-400",
  failed: "bg-red-500/15 text-red-400",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabaseAdmin = getSupabaseAdmin();

  let query = supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: orders, error } = await query;

  const totalRevenue = (orders || [])
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display font-bold text-xl">Orders</h1>
        <div className="flex items-center gap-4 text-sm text-dim">
          <span>{orders?.length || 0} total</span>
          <span className="font-mono text-paper">
            ₹{(totalRevenue / 100).toLocaleString("en-IN")} revenue
          </span>
        </div>
      </div>

      <div className="flex gap-2 text-xs">
        {["all", "paid", "created", "failed"].map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin" : `/admin?status=${s}`}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              (status || "all") === s
                ? "border-paper/60 text-paper"
                : "border-line text-dim hover:text-paper"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-400">Error loading orders: {error.message}</p>
      )}

      <div className="glass-strong rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-dim text-left">
              <th className="px-4 py-3 font-normal">Order</th>
              <th className="px-4 py-3 font-normal">Customer</th>
              <th className="px-4 py-3 font-normal">Items</th>
              <th className="px-4 py-3 font-normal">Amount</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr
                key={order.id}
                className="border-b border-line/50 last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-mono text-xs hover:underline"
                  >
                    {order.razorpay_order_id.slice(-10)}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div>{order.customer_name}</div>
                  <div className="text-xs text-dim">{order.customer_email}</div>
                </td>
                <td className="px-4 py-3 text-xs text-dim">
                  {(order.items as any[])
                    .map((i) => `${i.size} ×${i.qty}`)
                    .join(", ")}
                </td>
                <td className="px-4 py-3 font-mono">
                  ₹{(order.amount / 100).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      STATUS_STYLES[order.status] || "bg-white/10 text-dim"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-dim">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders?.length === 0 && (
          <p className="text-center text-dim text-sm py-10">No orders yet.</p>
        )}
      </div>
    </div>
  );
}