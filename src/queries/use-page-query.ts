import { useQuery } from "@tanstack/react-query";
import type { PageModel } from "@/generated/prisma/models/Page";

export const pageQueryKey = ["page"] as const;

async function fetchPage(): Promise<PageModel> {
  const res = await fetch("/api/dashboard/page");
  if (!res.ok) throw new Error("Falha ao buscar página");
  const data = await res.json();
  return data.page;
}

export function usePageQuery() {
  return useQuery({
    queryKey: pageQueryKey,
    queryFn: fetchPage,
  });
}
