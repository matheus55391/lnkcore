"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLink } from "@/actions/links/update-link";
import type { UpdateLinkInput } from "@/schemas/links";
import { linksQueryKey } from "./use-links-query";
import { pageQueryKey } from "./use-page-query";
import { pagesQueryKey } from "./use-pages-query";

type Options = {
  pageId: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

export function useUpdateLinkMutation({ pageId, onSuccess, onError }: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateLinkInput) => {
      const result = await updateLink(values);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey(pageId) });
      queryClient.invalidateQueries({ queryKey: pageQueryKey(pageId) });
      queryClient.invalidateQueries({ queryKey: pagesQueryKey });
      onSuccess?.();
    },
    onError,
  });
}
