import { useQuery } from "@tanstack/react-query";
import type { LinkModel } from "@/generated/prisma/models/Link";

export const linksQueryKey = ["links"] as const;

async function fetchLinks(): Promise<LinkModel[]> {
  const res = await fetch("/api/dashboard/links");
  if (!res.ok) throw new Error("Falha ao buscar links");
  const data = await res.json();
  return data.links;
}

export function useLinksQuery() {
  return useQuery({
    queryKey: linksQueryKey,
    queryFn: fetchLinks,
  });
}
