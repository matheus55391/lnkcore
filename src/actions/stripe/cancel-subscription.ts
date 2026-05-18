"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { requireSession } from "@/utils/session";
import type { ActionResult } from "@/@types/action-result";

export async function cancelSubscription(): Promise<ActionResult> {
  const session = await requireSession();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { stripeSubscriptionId: true },
  });

  if (!user.stripeSubscriptionId) {
    return { success: false, error: "Nenhuma assinatura ativa encontrada." };
  }

  await stripe.subscriptions.update(user.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: user.stripeSubscriptionId },
    data: { cancelAtPeriodEnd: true },
  });

  return { success: true };
}
