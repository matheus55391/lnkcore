"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, type CurrentUser } from "@/actions/user/get-current-user";

export const currentUserQueryKey = ["current-user"] as const;

export function useCurrentUser() {
  return useQuery<CurrentUser | null>({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      const result = await getCurrentUser();
      return result.success ? result.data : null;
    },
  });
}
