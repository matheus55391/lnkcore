import { Link } from "./link";

export type Page = {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  image: string | null;
  published: boolean;
  themeId: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  links?: Link[];
};
