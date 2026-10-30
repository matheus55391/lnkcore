export const LinkType = {
  CLASSIC: "CLASSIC",
  SOCIAL: "SOCIAL",
  FEATURED: "FEATURED",
} as const;

export type LinkType = (typeof LinkType)[keyof typeof LinkType];

export const FeaturedSize = {
  COMPACT: "COMPACT",
  TALL: "TALL",
} as const;

export type FeaturedSize = (typeof FeaturedSize)[keyof typeof FeaturedSize];

export const ClassicLinkStyle = {
  CLASSIC: "CLASSIC",
  FEATURED: "FEATURED",
  FEATURED_TALL: "FEATURED_TALL",
} as const;

export type ClassicLinkStyle =
  (typeof ClassicLinkStyle)[keyof typeof ClassicLinkStyle];

export type Link = {
  id: string;
  title: string;
  url: string;
  image: string | null;
  emoji: string | null;
  type: LinkType;
  featuredSize: FeaturedSize;
  active: boolean;
  position: number;
  pageId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function isFeaturedLink(link: Pick<Link, "type">): boolean {
  return link.type === LinkType.FEATURED;
}
