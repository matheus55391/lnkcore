import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { Plan } from "@/@types";
import { sendDiscordLog } from "@/lib/discord-log";

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
        await sendDiscordLog(
          "Pagamento confirmado",
          `Usuário ${updated.id} agora é PRO.`
        );
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
        const priceId = sub.items.data[0]?.price?.id ?? "";
        const item = sub.items.data[0];
        const periodStart = new Date((item?.current_period_start ?? 0) * 1000);
        const periodEnd = new Date((item?.current_period_end ?? 0) * 1000);

        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: {
              plan: active ? Plan.PRO : Plan.FREE,
              stripeSubscriptionId: sub.id,
              stripeCustomerId: customerId ?? undefined,
            },
          }),
          prisma.subscription.upsert({
            where: { stripeSubscriptionId: sub.id },
            create: {
              userId,
              stripeSubscriptionId: sub.id,
              stripeCustomerId: customerId ?? "",
              status: sub.status,
              priceId,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              canceledAt: sub.canceled_at
                ? new Date(sub.canceled_at * 1000)
                : null,
              trialStart: sub.trial_start
                ? new Date(sub.trial_start * 1000)
                : null,
              trialEnd: sub.trial_end
                ? new Date(sub.trial_end * 1000)
                : null,
            },
            update: {
              userId,
              stripeCustomerId: customerId ?? undefined,
              status: sub.status,
              priceId,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              canceledAt: sub.canceled_at
                ? new Date(sub.canceled_at * 1000)
                : null,
              trialStart: sub.trial_start
                ? new Date(sub.trial_start * 1000)
                : null,
              trialEnd: sub.trial_end
                ? new Date(sub.trial_end * 1000)
                : null,
            },
          }),
        ]);

        await sendDiscordLog(
          event.type === "customer.subscription.created"
            ? "Assinatura criada"
            : "Assinatura atualizada",
          `Usuário \`${userId}\` — status: **${sub.status}**${sub.cancel_at_period_end ? " (cancela ao fim do período)" : ""}`,
          active ? "log" : "error"
        );
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
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { plan: Plan.FREE },
          }),
          prisma.subscription.updateMany({
            where: { stripeSubscriptionId: sub.id },
            data: {
              status: sub.status,
              canceledAt: sub.canceled_at
                ? new Date(sub.canceled_at * 1000)
                : new Date(),
            },
          }),
        ]);

        await sendDiscordLog(
          event.type === "customer.subscription.paused"
            ? "Assinatura pausada"
            : "Assinatura cancelada",
          `Usuário \`${userId}\` voltou para FREE.`,
          "error"
        );
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = extractId(invoice.customer);
        const subscriptionId = extractId(
          invoice.parent?.subscription_details?.subscription
        );
        const metaUserId = invoice.metadata?.userId;

        const userId = await findUserId({
          userId: metaUserId,
          customerId,
          subscriptionId,
        });

        console.log("[stripe-webhook] invoice.paid", {
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          resolvedUserId: userId,
        });

        if (!userId || !invoice.id) break;

        const dbSubscription = subscriptionId
          ? await prisma.subscription.findUnique({
              where: { stripeSubscriptionId: subscriptionId },
            })
          : null;

        const line = invoice.lines.data[0];
        const periodStart = line?.period?.start
          ? new Date(line.period.start * 1000)
          : null;
        const periodEnd = line?.period?.end
          ? new Date(line.period.end * 1000)
          : null;
        const paidAt = invoice.status_transitions?.paid_at
          ? new Date(invoice.status_transitions.paid_at * 1000)
          : invoice.status === "paid"
            ? new Date()
            : null;

        const formattedAmount = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: invoice.currency.toUpperCase(),
        }).format(invoice.amount_paid / 100);

        await prisma.payment.upsert({
          where: { stripeInvoiceId: invoice.id },
          create: {
            userId,
            subscriptionId: dbSubscription?.id ?? null,
            stripeInvoiceId: invoice.id,
            stripeChargeId: null,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status ?? "paid",
            description: invoice.description,
            periodStart,
            periodEnd,
            invoiceUrl: invoice.hosted_invoice_url,
            invoicePdf: invoice.invoice_pdf,
            paidAt,
          },
          update: {
            stripeChargeId: null,
            amount: invoice.amount_paid,
            status: invoice.status ?? "paid",
            invoiceUrl: invoice.hosted_invoice_url,
            invoicePdf: invoice.invoice_pdf,
            paidAt,
          },
        });

        await sendDiscordLog(
          "Pagamento recebido",
          `Usuário \`${userId}\` — **${formattedAmount}** (fatura \`${invoice.id}\`)`,
          "log"
        );
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
