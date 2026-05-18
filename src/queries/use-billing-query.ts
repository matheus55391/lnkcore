"use client";

import { useQuery } from "@tanstack/react-query";
import { getBillingInfo } from "@/actions/stripe/get-billing-info";

export const billingQueryKey = ["billing"] as const;

export function useBillingQuery() {
  return useQuery({
    queryKey: billingQueryKey,
    queryFn: async () => {
      const result = await getBillingInfo();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
