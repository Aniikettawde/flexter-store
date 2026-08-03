import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const VALID_STATUSES = ["received", "shipped", "delivered"] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { fulfillment_status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { fulfillment_status } = body;
  if (!fulfillment_status || !VALID_STATUSES.includes(fulfillment_status as any)) {
    return NextResponse.json({ error: "Invalid fulfillment_status" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ fulfillment_status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Failed to update fulfillment status:", error);
    return NextResponse.json({ error: "Could not update order" }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}