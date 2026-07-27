import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password");

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }

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
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-ink px-4">
      <form
        action={login}
        className="w-full max-w-sm glass-strong rounded-2xl p-8 space-y-4"
      >
        <h1 className="font-display font-bold text-lg tracking-wide text-center mb-2">
          ADMIN LOGIN
        </h1>
        {error && (
          <p className="text-xs text-red-400 text-center">
            Incorrect password. Try again.
          </p>
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