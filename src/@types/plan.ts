export const Plan = {
  FREE: "FREE",
  PRO: "PRO",
} as const;

export type Plan = (typeof Plan)[keyof typeof Plan];
