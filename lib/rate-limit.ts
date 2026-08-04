import { getSupabaseAdmin } from "@/lib/supabase";

const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function checkRateLimit(identifier: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("login_attempts")
    .select("*")
    .eq("identifier", identifier)
    .maybeSingle();

  if (data?.locked_until) {
    const lockedUntil = new Date(data.locked_until).getTime();
    if (lockedUntil > Date.now()) {
      return { allowed: false as const, retryAfterMs: lockedUntil - Date.now() };
    }
  }
  return { allowed: true as const };
}

export async function recordFailedAttempt(identifier: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("login_attempts")
    .select("*")
    .eq("identifier", identifier)
    .maybeSingle();

  const attempts = (data?.attempts ?? 0) + 1;
  const locked_until =
    attempts >= MAX_ATTEMPTS
      ? new Date(Date.now() + LOCKOUT_MS).toISOString()
      : data?.locked_until ?? null;

  await supabase.from("login_attempts").upsert({
    identifier,
    attempts,
    locked_until,
    last_attempt_at: new Date().toISOString(),
  });
}

export async function clearAttempts(identifier: string) {
  const supabase = getSupabaseAdmin();
  await supabase.from("login_attempts").delete().eq("identifier", identifier);
}