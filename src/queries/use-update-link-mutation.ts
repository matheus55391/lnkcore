import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateLinkSchema } from "@/schemas/link";
import { linksQueryKey } from "./use-links-query";

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export const updateLinkResolver = zodResolver(updateLinkSchema);

async function updateLink({
  linkId,
  data,
}: {
  linkId: string;
  data: UpdateLinkInput;
}) {
  const res = await fetch(`/api/dashboard/links/${linkId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error ?? "Falha ao atualizar link");
  }
  return res.json();
}

export function useUpdateLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });
}
