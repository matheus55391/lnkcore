import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SlugPageView } from "@/components/page-slug-view";

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
}) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
    select: { title: true, bio: true },
  });
  if (!page) return { title: "Página não encontrada" };
  return { title: page.title, description: page.bio ?? undefined };
}
