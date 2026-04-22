type Bucket = {
  count: number;
  resetAt: number;
};

const windowMs = 60_000;
const maxAttempts = 10;
const buckets = new Map<string, Bucket>();

export function checkRateLimit(identifier: string) {
  const now = Date.now();
  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt <= now) {
    buckets.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { ok: true };
  }

  if (existing.count >= maxAttempts) {
    return {
      ok: false,
      retryAfterMs: Math.max(0, existing.resetAt - now),
    };
  }

  existing.count += 1;
  buckets.set(identifier, existing);
  return { ok: true };
}
