import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Safe to use in the browser — read-only capabilities via RLS.
export const supabase = createClient(supabaseUrl, anonKey);

// Server-only client with the service role key. Never import this file
// from a "use client" component. Only used inside app/api/* route handlers.
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
