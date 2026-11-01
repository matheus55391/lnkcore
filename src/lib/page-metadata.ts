import type { Metadata } from "next";

export const SITE_URL = "https://www.makebio.com.br";

export type PublicPageMetaInput = {
  slug: string;
  title: string;
  bio: string | null;
  image: string | null;
  published: boolean;
};

export function buildPublicPageMetadata(
  page: PublicPageMetaInput | null
): Metadata {
  if (!page || !page.published) {
    return {
      title: "Página não encontrada",
      robots: { index: false, follow: false },
    };
  }

  const description =
    page.bio?.trim() || `${page.title} (@${page.slug}) no MakeBio`;
  const url = `${SITE_URL}/${page.slug}`;
  const images = page.image
    ? [{ url: page.image, alt: page.title }]
    : [];

  return {
    title: { absolute: page.title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: "MakeBio",
      title: page.title,
      description,
      images,
    },
    twitter: {
      card: page.image ? "summary_large_image" : "summary",
      title: page.title,
      description,
      images: page.image ? [page.image] : [],
    },
  };
}
