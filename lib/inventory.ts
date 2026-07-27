import { supabase, getSupabaseAdmin } from "./supabase";
import { SIZES, type Size } from "./product";

export type InventoryRow = { size: Size; stock: number };

// Public, read-only — used by the storefront
export async function getPublicInventory(): Promise<Record<Size, number>> {
  const map = Object.fromEntries(SIZES.map((s) => [s, 0])) as Record<Size, number>;
  const { data, error } = await supabase.from("product_inventory").select("size, stock");
  if (!error && data) {
    for (const row of data) map[row.size as Size] = row.stock;
  }
  return map;
}

// Admin — used inside app/api/admin/* route handlers only
export async function getAdminInventory(): Promise<InventoryRow[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("product_inventory")
    .select("size, stock")
    .order("size");
  if (error) throw error;

  // guarantee all 5 sizes are present even if a row is missing
  const bySize = new Map((data ?? []).map((r) => [r.size, r.stock]));
  return SIZES.map((s) => ({ size: s, stock: bySize.get(s) ?? 0 }));
}

export async function updateInventory(updates: InventoryRow[]) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("product_inventory")
    .upsert(
      updates.map((u) => ({ ...u, updated_at: new Date().toISOString() }))
    );
  if (error) throw error;
}