export const AdornmentMode = {
  NONE: "none",
  EMOJI: "emoji",
  IMAGE: "image",
} as const;

export type AdornmentMode =
  (typeof AdornmentMode)[keyof typeof AdornmentMode];
