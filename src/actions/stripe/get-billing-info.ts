"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import type { ActionResult } from "@/@types/action-result";

export type BillingPayment = {
  id: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  periodStart: Date | null;
  periodEnd: Date | null;
  invoiceUrl: string | null;
  invoicePdf: string | null;
  paidAt: Date | null;
  createdAt: Date;
};

export type BillingSubscription = {
  id: string;
  status: string;
  priceId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  trialEnd: Date | null;
};

export type BillingInfo = {
  plan: "FREE" | "PRO";
  subscription: BillingSubscription | null;
  payments: BillingPayment[];
};

export async function getBillingInfo(): Promise<ActionResult<BillingInfo>> {
  const session = await requireSession();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      plan: true,
      subscription: {
        select: {
          id: true,
          status: true,
          priceId: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
          canceledAt: true,
          trialEnd: true,
        },
      },
      payments: {
        select: {
          id: true,
          stripeInvoiceId: true,
          amount: true,
          currency: true,
          status: true,
          periodStart: true,
          periodEnd: true,
          invoiceUrl: true,
          invoicePdf: true,
          paidAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 24,
      },
    },
  });

  return {
    success: true,
    data: {
      plan: user.plan as "FREE" | "PRO",
      subscription: user.subscription,
      payments: user.payments,
    },
  };
}
