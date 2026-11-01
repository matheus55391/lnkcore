import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SlugPageView } from "@/components/page-slug-view";
import { buildPublicPageMetadata } from "@/lib/page-metadata";

type Params = { slug: string };

export default async function PublicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      links: {
        where: { active: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!page || !page.published) notFound();

  return (
    <SlugPageView page={page} />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      bio: true,
      image: true,
      published: true,
    },
  });
  return buildPublicPageMetadata(page);
}
