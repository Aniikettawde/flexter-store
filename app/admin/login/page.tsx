import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  safeCompare,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
} from "@/lib/admin-auth";
import { checkRateLimit, recordFailedAttempt, clearAttempts } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function login(formData: FormData) {
  "use server";

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  const rate = await checkRateLimit(ip);
  if (!rate.allowed) {
    const minutes = Math.ceil(rate.retryAfterMs / 60000);
    redirect(`/admin/login?error=locked&minutes=${minutes}`);
  }

  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (typeof password !== "string" || !adminPassword || !safeCompare(password, adminPassword)) {
    await recordFailedAttempt(ip);
    redirect("/admin/login?error=1");
  }

  await clearAttempts(ip);

  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });
  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; minutes?: string }>;
}) {
  const { error, minutes } = await searchParams;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-ink px-4">
      <form action={login} className="w-full max-w-sm glass-strong rounded-2xl p-8 space-y-4">
        <h1 className="font-display font-bold text-lg tracking-wide text-center mb-2">
          ADMIN LOGIN
        </h1>
        {error === "locked" && (
          <p className="text-xs text-red-400 text-center">
            Too many failed attempts. Try again in {minutes} minute{minutes === "1" ? "" : "s"}.
          </p>
        )}
        {error === "1" && (
          <p className="text-xs text-red-400 text-center">Incorrect password. Try again.</p>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="w-full h-11 rounded-xl bg-white/[0.04] border border-line px-3.5 text-sm focus:border-paper/40 outline-none transition-colors"
        />
        <button
          type="submit"
          className="w-full h-11 rounded-full bg-paper text-ink font-medium text-sm tracking-wide hover:bg-white transition-colors"
        >
          Log in
        </button>
      </form>
    </div>
  );
}