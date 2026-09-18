import { beforeEach, describe, expect, it } from "vitest";
import { isRateLimited, resetRateLimitStore } from "@/lib/rate-limit";

describe("isRateLimited", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("allows up to maxRequests within the window", () => {
    expect(isRateLimited("k", 2, 60_000)).toBe(false);
    expect(isRateLimited("k", 2, 60_000)).toBe(false);
    expect(isRateLimited("k", 2, 60_000)).toBe(true);
  });

  it("isolates keys", () => {
    expect(isRateLimited("a", 1, 60_000)).toBe(false);
    expect(isRateLimited("a", 1, 60_000)).toBe(true);
    expect(isRateLimited("b", 1, 60_000)).toBe(false);
  });
});
