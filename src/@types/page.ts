import { Link } from "./link";

export const PageLayout = {
  CLASSIC: "CLASSIC",
  COVER: "COVER",
} as const;

export type PageLayout = (typeof PageLayout)[keyof typeof PageLayout];

export type Page = {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  image: string | null;
  published: boolean;
  themeId: number;
  layout: PageLayout;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  links?: Link[];
};
