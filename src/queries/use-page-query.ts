"use client";

import { useQuery } from "@tanstack/react-query";
import { getPage, type PageDetail } from "@/actions/pages/get-page";

export const pageQueryKey = (pageId: string) => ["page", pageId] as const;

export function usePage(pageId: string) {
  return useQuery<PageDetail | null>({
    queryKey: pageQueryKey(pageId),
    queryFn: () => getPage(pageId),
    enabled: Boolean(pageId),
  });
}
