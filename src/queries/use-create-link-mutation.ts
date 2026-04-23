"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "@/actions/links/create-link";
import type { CreateLinkInput } from "@/schemas/links";
import { linksQueryKey } from "./use-links-query";

type Options = {
  pageId: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

export function useCreateLinkMutation({ pageId, onSuccess, onError }: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateLinkInput) => {
      const result = await createLink(values);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey(pageId) });
      onSuccess?.();
    },
    onError,
  });
}
