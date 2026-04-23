"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_PRO_PRICE_ID } from "@/lib/stripe";
import { requireSession } from "@/utils/session";
import type { ActionResult } from "@/@types/action-result";

export async function createCheckoutSession(): Promise<
  ActionResult<{ url: string }>
> {
  const session = await requireSession();

  if (!STRIPE_PRO_PRICE_ID) {
    return { success: false, error: "Stripe não configurado." };
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const h = await headers();
  const origin =
    h.get("origin") ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/dashboard`,
    metadata: { userId: user.id },
    subscription_data: { metadata: { userId: user.id } },
  });

  if (!checkout.url) {
    return { success: false, error: "Falha ao criar sessão de pagamento." };
  }

  return { success: true, data: { url: checkout.url } };
}
