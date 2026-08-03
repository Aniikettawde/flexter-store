"use client";

import { useState } from "react";
import { Package, Truck, Home } from "lucide-react";

type TrackedOrder = {
  order_number: string;
  fulfillment_status: "received" | "shipped" | "delivered";
  status: string;
  payment_method: "cod" | "prepaid";
  items: { size: string; qty: number; price: number }[];
  amount: number;
  cod_charge: number;
  created_at: string;
};

const STAGES = [
  { key: "received", label: "Order received", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
] as const;

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: orderNumber, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Couldn't find that order.");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStageIndex = order
    ? STAGES.findIndex((s) => s.key === order.fulfillment_status)
    : -1;

  return (
    <main className="min-h-[100dvh] pt-32 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-md">
        <h1 className="font-display font-bold text-xl mb-2">Track your order</h1>
        <p className="text-sm text-dim mb-8">
          Enter your order number and the email you used at checkout.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-[11px] uppercase tracking-widest text-dim mb-1.5">
              Order number
            </span>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="FLX-001007"
              required
              className="w-full h-11 rounded-xl bg-white/[0.04] border border-line px-3.5 text-sm outline-none focus:border-paper/40 transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-[11px] uppercase tracking-widest text-dim mb-1.5">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 rounded-xl bg-white/[0.04] border border-line px-3.5 text-sm outline-none focus:border-paper/40 transition-colors"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-paper text-ink font-medium text-sm tracking-wide hover:bg-white transition-colors disabled:opacity-40"
          >
            {loading ? "Searching…" : "Track order"}
          </button>
        </form>

        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}

        {order && (
          <div className="mt-8 glass-strong rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono">{order.order_number}</span>
              <span className="text-dim text-xs">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-start">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const reached = idx <= currentStageIndex;
                return (
                  <div key={stage.key} className="flex-1 flex flex-col items-center relative">
                    {idx > 0 && (
                      <div
                        className={`absolute right-1/2 top-4 h-[2px] w-full -z-10 ${
                          idx <= currentStageIndex ? "bg-paper" : "bg-line"
                        }`}
                      />
                    )}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center border ${
                        reached ? "bg-paper border-paper text-ink" : "border-line text-dim"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <span
                      className={`mt-2 text-[11px] text-center ${
                        reached ? "text-paper" : "text-dim"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {order.payment_method === "cod" && order.status === "cod_pending" && (
              <p className="text-xs text-dim bg-white/[0.03] border border-line rounded-xl px-3.5 py-2.5">
                Cash on delivery — please keep ₹
                {(order.amount / 100).toLocaleString("en-IN")} ready for the courier.
              </p>
            )}

            <div className="space-y-1.5 border-t border-line pt-4">
              {order.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-dim">
                    Size {i.size} × {i.qty}
                  </span>
                  <span className="font-mono">₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-medium pt-1">
                <span>Total</span>
                <span className="font-mono">₹{(order.amount / 100).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}