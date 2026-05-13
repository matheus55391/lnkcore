"use client";

import { useQuery } from "@tanstack/react-query";
import { listPages, type PageListItem } from "@/actions/pages/list-pages";

export const pagesQueryKey = ["pages"] as const;

export function usePages() {
  return useQuery<PageListItem[]>({
    queryKey: pagesQueryKey,
    queryFn: () => listPages(),
  });
}
