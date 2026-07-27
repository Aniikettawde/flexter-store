import { NextResponse } from "next/server";
import { getPublicInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const inventory = await getPublicInventory();
  return NextResponse.json({ inventory });
}