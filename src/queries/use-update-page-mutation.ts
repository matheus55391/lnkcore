import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updatePageSchema } from "@/schemas/page";
import { pageQueryKey } from "./use-page-query";

export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export const updatePageResolver = zodResolver(updatePageSchema);

async function updatePage(data: UpdatePageInput) {
  const res = await fetch("/api/dashboard/page", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error ?? "Falha ao atualizar página");
  }
  return res.json();
}

export function useUpdatePageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageQueryKey });
    },
  });
}
