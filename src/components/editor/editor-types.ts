export const EditorSection = {
  CONTENT: "content",
  PROFILE: "profile",
  APPEARANCE: "appearance",
} as const;

export type EditorSection =
  (typeof EditorSection)[keyof typeof EditorSection];

export const ContentTab = {
  LINKS: "links",
  SOCIALS: "socials",
} as const;

export type ContentTab = (typeof ContentTab)[keyof typeof ContentTab];
