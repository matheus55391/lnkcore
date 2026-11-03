export const SubscriptionStatus = {
  ACTIVE: "active",
  TRIALING: "trialing",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
  UNPAID: "unpaid",
  PAUSED: "paused",
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const PaymentStatus = {
  PAID: "paid",
  OPEN: "open",
  VOID: "void",
  UNCOLLECTIBLE: "uncollectible",
} as const;

export type PaymentStatus =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];
