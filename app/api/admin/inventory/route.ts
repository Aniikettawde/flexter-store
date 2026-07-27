import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { getAdminInventory, updateInventory } from "@/lib/inventory";
import { SIZES } from "@/lib/product";

async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const inventory = await getAdminInventory();
    return NextResponse.json({ inventory });
  } catch (err) {
    console.error("Failed to load inventory:", err);
    return NextResponse.json({ message: "Failed to load inventory" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const updates = body?.updates;

  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }
  for (const u of updates) {
    if (!SIZES.includes(u.size) || typeof u.stock !== "number" || u.stock < 0) {
      return NextResponse.json(
        { message: `Invalid stock value for size ${u.size}` },
        { status: 400 }
      );
    }
  }

  try {
    await updateInventory(updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to update inventory:", err);
    return NextResponse.json({ message: "Failed to update inventory" }, { status: 500 });
  }
}