"use client";

import { Loader2Icon } from "lucide-react";

import { Plan } from "@/@types";
import { AccountShell } from "@/components/account/account-shell";
import { AccountTab } from "@/components/account/account-tab";
import { PlanCard } from "@/components/billing/plan-card";
import { PlanComparisonCard } from "@/components/billing/plan-comparison-card";
import { PaymentsCard } from "@/components/billing/payments-card";
import { useBillingQuery } from "@/queries/use-billing-query";

export function BillingView() {
  const { data, isLoading } = useBillingQuery();
  const plan = data?.plan ?? Plan.FREE;

  return (
    <AccountShell activeTab={AccountTab.BILLING}>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <PlanCard plan={plan} subscription={data?.subscription ?? null} />
          {plan === Plan.FREE && <PlanComparisonCard />}
          <PaymentsCard payments={data?.payments ?? []} />
        </>
      )}
    </AccountShell>
  );
}
