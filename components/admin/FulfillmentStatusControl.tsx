"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STAGES = ["received", "shipped", "delivered"] as const;
type Stage = (typeof STAGES)[number];

export default function FulfillmentStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: Stage;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Stage>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (next: Stage) => {
    if (next === status || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillment_status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Update failed");
      }
      setStatus(next);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {STAGES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={saving}
            onClick={() => handleChange(s)}
            className={`h-9 rounded-lg border text-xs font-medium capitalize transition-colors disabled:opacity-40 ${
              status === s
                ? "bg-paper text-ink border-paper"
                : "border-line text-dim hover:text-paper hover:border-paper/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}