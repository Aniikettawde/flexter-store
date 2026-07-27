"use client";

import { useState } from "react";
import type { InventoryRow } from "@/lib/inventory";

export default function InventoryEditor({
  initialInventory,
}: {
  initialInventory: InventoryRow[];
}) {
  const [stock, setStock] = useState<Record<string, number>>(
    Object.fromEntries(initialInventory.map((i) => [i.size, i.stock]))
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setQty = (size: string, value: number) => {
    setStock((s) => ({ ...s, [size]: Math.max(0, value) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: Object.entries(stock).map(([size, qty]) => ({
            size,
            stock: qty,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to save");
      }
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to save inventory");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-5 max-w-md space-y-4">
      {Object.entries(stock).map(([size, qty]) => (
        <div key={size} className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium w-12">{size}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQty(size, qty - 1)}
              className="h-8 w-8 rounded-full border border-line hover:border-paper/50 transition-colors"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              value={qty}
              onChange={(e) => setQty(size, Number(e.target.value) || 0)}
              className="w-16 h-9 text-center rounded-xl bg-white/[0.04] border border-line outline-none focus:border-paper/40"
            />
            <button
              type="button"
              onClick={() => setQty(size, qty + 1)}
              className="h-8 w-8 rounded-full border border-line hover:border-paper/50 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      ))}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full h-11 rounded-full bg-paper text-ink font-medium text-sm disabled:opacity-40 transition-colors"
      >
        {saving ? "Saving…" : savedAt ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}