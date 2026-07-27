import { getAdminInventory } from "@/lib/inventory";
import InventoryEditor from "./InventoryEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInventoryPage() {
  const inventory = await getAdminInventory();
  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl">Inventory</h1>
      <p className="text-sm text-dim">
        Stock levels for {"Flexter Compression Tee"} by size. Changes go live on the
        storefront immediately.
      </p>
      <InventoryEditor initialInventory={inventory} />
    </div>
  );
}