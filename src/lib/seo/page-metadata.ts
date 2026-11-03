import type { Metadata } from "next";

export const SITE_URL = "https://www.makebio.com.br";

export type PublicPageMetaInput = {
  slug: string;
  title: string;
  bio: string | null;
  image: string | null;
  published: boolean;
};

export function buildPublicPageDescription(
  page: Pick<PublicPageMetaInput, "slug" | "title" | "bio">
): string {
  const bio = page.bio?.trim();
  if (bio) return `${page.title} (@${page.slug}) — ${bio}`;
  return `${page.title} (@${page.slug}) no MakeBio`;
}

export function buildPublicPageMetadata(
  page: PublicPageMetaInput | null
): Metadata {
  if (!page || !page.published) {
    return {
      title: "Página não encontrada",
      robots: { index: false, follow: false },
    };
  }

  const description = buildPublicPageDescription(page);
  const url = `${SITE_URL}/${page.slug}`;
  const imageUrl = page.image?.trim() || null;
  const images = imageUrl
    ? [
        {
          url: imageUrl,
          alt: page.title,
        },
      ]
    : [];

  // openGraph/twitter replace the root layout objects entirely (shallow merge),
  // so every field Discord needs must be set here — including images.
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
      card: imageUrl ? "summary_large_image" : "summary",
      title: page.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}
