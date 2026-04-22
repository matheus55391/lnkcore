import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createLinkSchema } from "@/schemas/link";
import { linksQueryKey } from "./use-links-query";

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export const createLinkResolver = zodResolver(createLinkSchema);

async function createLink(data: CreateLinkInput) {
  const res = await fetch("/api/dashboard/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error ?? "Falha ao criar link");
  }
  return res.json();
}

export function useCreateLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });
}
