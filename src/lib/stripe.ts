import "server-only";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Apenas aviso — não quebra o build em dev sem env configurada.
  // Chamadas reais falharão até setar STRIPE_SECRET_KEY.
  console.warn("[stripe] STRIPE_SECRET_KEY não configurada.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
