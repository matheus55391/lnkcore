import { afterEach, describe, expect, it } from "vitest";
import { isProPriceId } from "@/lib/stripe-price";

describe("isProPriceId", () => {
  const prev = process.env.STRIPE_PRO_PRICE_ID;

  afterEach(() => {
    if (prev === undefined) delete process.env.STRIPE_PRO_PRICE_ID;
    else process.env.STRIPE_PRO_PRICE_ID = prev;
  });

  it("returns true only for the configured PRO price", () => {
    process.env.STRIPE_PRO_PRICE_ID = "price_pro_123";
    expect(isProPriceId("price_pro_123")).toBe(true);
    expect(isProPriceId("price_other")).toBe(false);
    expect(isProPriceId(null)).toBe(false);
    expect(isProPriceId(undefined)).toBe(false);
    expect(isProPriceId("")).toBe(false);
  });

  it("fails closed when STRIPE_PRO_PRICE_ID is unset", () => {
    delete process.env.STRIPE_PRO_PRICE_ID;
    expect(isProPriceId("price_pro_123")).toBe(false);
  });
});
