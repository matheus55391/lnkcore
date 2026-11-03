import "server-only";
import Stripe from "stripe";

// Lazy singleton — evita instanciar Stripe em build time (sem env vars).
// A chave real é injetada apenas em runtime via docker-compose / .env.
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("[stripe] STRIPE_SECRET_KEY não configurada.");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
