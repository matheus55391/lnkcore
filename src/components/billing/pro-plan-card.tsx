"use client";

import { AlertTriangleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plan, SubscriptionStatus } from "@/@types";
import { CancelSubscriptionDialog } from "@/components/billing/cancel-subscription-dialog";
import {
  formatBillingDate,
  subscriptionStatusLabel,
} from "@/components/billing/billing-format";
import type { BillingSubscription } from "@/actions/stripe/get-billing-info";

type ProPlanCardProps = {
  subscription: BillingSubscription;
};

export function ProPlanCard({ subscription }: ProPlanCardProps) {
  const { label, variant } = subscriptionStatusLabel(subscription.status);
  const isCancelScheduled = subscription.cancelAtPeriodEnd;
  const isCanceled = subscription.status === SubscriptionStatus.CANCELED;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Plano atual
          <Badge variant="default">{Plan.PRO}</Badge>
          <Badge variant={variant}>{label}</Badge>
        </CardTitle>
        <CardDescription>
          {isCanceled
            ? "Sua assinatura foi cancelada."
            : isCancelScheduled
              ? `Acesso PRO até ${formatBillingDate(subscription.currentPeriodEnd)}. Após essa data o plano volta para FREE.`
              : `Próxima cobrança em ${formatBillingDate(subscription.currentPeriodEnd)}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">
              Período atual
            </p>
            <p>
              {formatBillingDate(subscription.currentPeriodStart)} –{" "}
              {formatBillingDate(subscription.currentPeriodEnd)}
            </p>
          </div>
          {subscription.trialEnd &&
            new Date(subscription.trialEnd) > new Date() && (
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">
                  Trial termina em
                </p>
                <p>{formatBillingDate(subscription.trialEnd)}</p>
              </div>
            )}
        </div>

        {isCancelScheduled && !isCanceled && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangleIcon className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              A renovação automática foi desativada. Você continua com acesso
              PRO até{" "}
              <strong>
                {formatBillingDate(subscription.currentPeriodEnd)}
              </strong>
              .
            </p>
          </div>
        )}

        {!isCanceled && !isCancelScheduled && <CancelSubscriptionDialog />}
      </CardContent>
    </Card>
  );
}
