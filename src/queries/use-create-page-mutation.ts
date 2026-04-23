"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage } from "@/actions/pages/create-page";
import type { CreatePageInput } from "@/schemas/pages";
import { pagesQueryKey } from "./use-pages-query";

type Options = {
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

export function useCreatePageMutation({ onSuccess, onError }: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreatePageInput) => {
      const result = await createPage(values);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesQueryKey });
      onSuccess?.();
    },
    onError,
  });
}
