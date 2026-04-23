export type Link = {
  id: string;
  title: string;
  url: string;
  image: string | null;
  active: boolean;
  position: number;
  pageId: string;
  createdAt: Date;
  updatedAt: Date;
};
