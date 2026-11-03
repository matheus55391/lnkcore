"use client";

import { Plan } from "@/@types";
import { FreePlanCard } from "@/components/billing/free-plan-card";
import { ProPlanCard } from "@/components/billing/pro-plan-card";
import type { BillingSubscription } from "@/actions/stripe/get-billing-info";

type PlanCardProps = {
  plan: Plan;
  subscription: BillingSubscription | null;
};

export function PlanCard({ plan, subscription }: PlanCardProps) {
  if (plan === Plan.PRO && subscription) {
    return <ProPlanCard subscription={subscription} />;
  }

  return <FreePlanCard />;
}
