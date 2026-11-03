/**
 * Returns true only when `priceId` matches the configured PRO price.
 * Fail closed when STRIPE_PRO_PRICE_ID is unset or priceId is missing.
 */
export function isProPriceId(priceId: string | null | undefined): boolean {
  const expected = process.env.STRIPE_PRO_PRICE_ID ?? "";
  return Boolean(expected && priceId && priceId === expected);
}
