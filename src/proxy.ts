import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// In-memory rate limiter — adequate for a single VPS deployment
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count++;
  return false;
}

// Purge expired entries every minute to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore) {
    if (now > value.resetAt) rateLimitStore.delete(key);
  }
}, 60_000);

export function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { pathname } = request.nextUrl;

  // Rate limit: auth endpoints — 20 requests/min per IP (brute force protection)
  if (pathname.startsWith("/api/auth/")) {
    if (isRateLimited(`auth:${ip}`, 20, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Rate limit: upload endpoint — 10 requests/min per IP
  if (pathname.startsWith("/api/upload")) {
    if (isRateLimited(`upload:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Protect dashboard routes — redirect unauthenticated users to sign-in
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/auth/:path*", "/api/upload/:path*"],
};

