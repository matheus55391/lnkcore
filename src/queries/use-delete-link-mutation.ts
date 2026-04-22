import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linksQueryKey } from "./use-links-query";

async function deleteLink(linkId: string) {
  const res = await fetch(`/api/dashboard/links/${linkId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error ?? "Falha ao deletar link");
  }
  return res.json();
}

export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });
}
