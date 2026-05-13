"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCheckoutSession } from "@/actions/stripe/create-checkout-session";
import { currentUserQueryKey } from "./use-current-user-query";

type Options = {
  onError?: (err: Error) => void;
};

export function useCreateCheckoutSessionMutation({ onError }: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await createCheckoutSession();
      if (!result.success) throw new Error(result.error);
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      window.location.href = result.data.url;
    },
    onError,
  });
}
