export const AccountTab = {
  PROFILE: "profile",
  BILLING: "billing",
} as const;

export type AccountTab = (typeof AccountTab)[keyof typeof AccountTab];
