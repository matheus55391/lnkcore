"use client";

import { useQuery } from "@tanstack/react-query";
import { listLinks } from "@/actions/links/list-links";
import type { Link } from "@/@types";

export const linksQueryKey = (pageId: string) => ["links", pageId] as const;

export function useLinks(pageId: string) {
  return useQuery<Link[]>({
    queryKey: linksQueryKey(pageId),
    queryFn: () => listLinks(pageId),
    enabled: Boolean(pageId),
  });
}
