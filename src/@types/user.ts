import type { Plan } from "./plan";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  plan: Plan;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};