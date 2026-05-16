import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { Plan } from "@/@types";

type UserLookup = {
  userId?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
};

async function findUserId({
  userId,
  customerId,
  subscriptionId,
}: UserLookup): Promise<string | null> {
  if (userId) {
    const foundUser = await prisma.user.findUnique({ where: { id: userId } });
    if (foundUser) return foundUser.id;
  }
  if (customerId) {
    const foundUser = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (foundUser) return foundUser.id;
  }
  if (subscriptionId) {
    const foundUser = await prisma.user.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
    });
    if (foundUser) return foundUser.id;
  }
  return null;
}

function extractId(
  value: string | { id: string } | null | undefined
): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET não configurado.");
    return NextResponse.json(
      { error: "Webhook secret não configurado." },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[stripe-webhook] assinatura inválida:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = extractId(session.customer);
        const subscriptionId = extractId(session.subscription);
        const metaUserId = session.metadata?.userId;
        const clientRefUserId = session.client_reference_id;

        const userId = await findUserId({
          userId: metaUserId ?? clientRefUserId,
          customerId,
          subscriptionId,
        });

        console.log("[stripe-webhook] checkout.session.completed", {
          sessionId: session.id,
          metaUserId,
          clientRefUserId,
          customerId,
          subscriptionId,
          resolvedUserId: userId,
        });

        if (!userId) {
          console.error(
            "[stripe-webhook] usuário não resolvido para checkout.session.completed"
          );
          break;
        }

        const updated = await prisma.user.update({
          where: { id: userId },
          data: {
            plan: Plan.PRO,
            stripeSubscriptionId: subscriptionId ?? undefined,
            stripeCustomerId: customerId ?? undefined,
          },
        });
        console.log("[stripe-webhook] plano atualizado", {
          userId: updated.id,
          plan: updated.plan,
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = extractId(sub.customer);
        const metaUserId = sub.metadata?.userId;
        const userId = await findUserId({
          userId: metaUserId,
          customerId,
          subscriptionId: sub.id,
        });

        console.log("[stripe-webhook]", event.type, {
          subId: sub.id,
          status: sub.status,
          customerId,
          metaUserId,
          resolvedUserId: userId,
        });

        if (!userId) break;

        const active = sub.status === "active" || sub.status === "trialing";
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: active ? Plan.PRO : Plan.FREE,
            stripeSubscriptionId: sub.id,
            stripeCustomerId: customerId ?? undefined,
          },
        });
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.paused": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = extractId(sub.customer);
        const userId = await findUserId({
          userId: sub.metadata?.userId,
          customerId,
          subscriptionId: sub.id,
        });
        console.log("[stripe-webhook]", event.type, {
          subId: sub.id,
          resolvedUserId: userId,
        });
        if (!userId) break;
        await prisma.user.update({
          where: { id: userId },
          data: { plan: Plan.FREE },
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] erro processando evento", event.type, err);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
