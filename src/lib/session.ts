import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Tiny signed-cookie helper for the guest "My trips" area and /admin.
const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_KEY || "serendib-dev-secret";

export function sign(value: string) {
  const mac = createHmac("sha256", secret()).update(value).digest("base64url");
  return `${Buffer.from(value).toString("base64url")}.${mac}`;
}

export function verify(token: string | undefined): string | null {
  if (!token) return null;
  const [b64, mac] = token.split(".");
  if (!b64 || !mac) return null;
  const value = Buffer.from(b64, "base64url").toString();
  const expected = createHmac("sha256", secret()).update(value).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? value : null;
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const TRIPS_COOKIE = "serendib_trips";
export const ADMIN_COOKIE = "serendib_admin";
