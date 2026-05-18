"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelSubscription } from "@/actions/stripe/cancel-subscription";
import { billingQueryKey } from "./use-billing-query";

type Options = {
  onError?: (err: Error) => void;
  onSuccess?: () => void;
};

export function useCancelSubscriptionMutation({ onError, onSuccess }: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await cancelSubscription();
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingQueryKey });
      onSuccess?.();
    },
    onError: (err) => onError?.(err instanceof Error ? err : new Error(String(err))),
  });
}
