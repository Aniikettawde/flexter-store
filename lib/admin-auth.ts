import crypto from "crypto";

const COOKIE_NAME = "flexter_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sign(value: string) {
  return crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET as string)
    .update(value)
    .digest("hex");
}

export function createSessionToken() {
  const payload = `admin.${Date.now()}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [prefix, ts, signature] = parts;
  const payload = `${prefix}.${ts}`;
  const expected = sign(payload);
  if (expected !== signature) return false;

  const age = Date.now() - Number(ts);
  if (age > MAX_AGE * 1000) return false;

  return true;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE;