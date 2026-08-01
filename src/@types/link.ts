export type LinkType = "CLASSIC" | "SOCIAL";

export type Link = {
  id: string;
  title: string;
  url: string;
  image: string | null;
  emoji: string | null;
  type: LinkType;
  active: boolean;
  position: number;
  pageId: string;
  createdAt: Date;
  updatedAt: Date;
};
