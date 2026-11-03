/** In-memory rate limiter — adequate for a single VPS deployment. */

type Entry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, Entry>();

export function isRateLimited(
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

/** Test helper — clears all buckets. */
export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}

// Purge expired entries every minute to avoid unbounded memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore) {
      if (now > value.resetAt) rateLimitStore.delete(key);
    }
  }, 60_000).unref?.();
}
