import { Plan } from "@/@types";

export const PLAN_LIMITS = {
  [Plan.FREE]: { maxPages: 1, maxLinksPerPage: 5, maxStoredImages: 10 },
  [Plan.PRO]: {
    maxPages: 5,
    maxLinksPerPage: 20,
    maxStoredImages: 40,
  },
} as const satisfies Record<
  Plan,
  { maxPages: number; maxLinksPerPage: number; maxStoredImages: number }
>;
