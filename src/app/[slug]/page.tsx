import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicPageBySlug } from "@/modules/page/service";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageBySlug(slug);
  if (!page) {
    return {
      title: "Página não encontrada | lnkcore",
      description: "Este perfil não existe ou foi removido.",
    };
  }

  const title = `${page.title} | lnkcore`;
  const description = page.description ?? `Links oficiais de ${page.title}`;
  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/${page.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      images: page.avatarUrl ? [{ url: page.avatarUrl }] : undefined,
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPublicPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-xl px-6 py-12">
      <header className="text-center">
        {page.avatarUrl ? (
          <Image
            src={page.avatarUrl}
            alt={page.title}
            className="mx-auto h-24 w-24 rounded-full object-cover"
            width={96}
            height={96}
            unoptimized
          />
        ) : (
          <div className="mx-auto h-24 w-24 rounded-full bg-zinc-200" />
        )}
        <h1 className="mt-4 text-2xl font-bold">{page.title}</h1>
        {page.description ? (
          <p className="mt-2 text-zinc-600">{page.description}</p>
        ) : null}
      </header>

      <main className="mt-8 space-y-3">
        {page.links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-zinc-200 px-4 py-3 transition hover:bg-zinc-50"
          >
            <p className="font-medium">{link.title}</p>
            {link.description ? (
              <p className="mt-1 text-sm text-zinc-600">{link.description}</p>
            ) : null}
          </a>
        ))}
      </main>
    </div>
  );
}
