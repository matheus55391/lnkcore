"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLink } from "@/actions/links/delete-link";
import { linksQueryKey } from "./use-links-query";

type Options = {
  pageId: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

export function useDeleteLinkMutation({ pageId, onSuccess, onError }: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteLink({ id });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey(pageId) });
      onSuccess?.();
    },
    onError,
  });
}
