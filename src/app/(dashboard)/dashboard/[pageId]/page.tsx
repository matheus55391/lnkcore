"use client";

import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, Loader2Icon } from "lucide-react";
import { use } from "react";

import { Button } from "@/components/ui/button";
import { LinksManager } from "@/components/links/links-manager";
import { usePage } from "@/queries/use-page-query";

type Params = { pageId: string };

export default function PageDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pageId } = use(params);

  const { data: page, isLoading } = usePage(pageId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-6 py-10">
        <p className="text-muted-foreground">Página não encontrada.</p>
        <Button asChild variant="link" className="px-0">
          <Link href="/dashboard">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-10 space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
          <Link href="/dashboard">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{page.title}</h1>
            <p className="text-muted-foreground text-sm">
              lnkcore.app/{page.slug}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/${page.slug}`} target="_blank">
              <ExternalLinkIcon className="h-3.5 w-3.5 mr-1" />
              Ver página
            </Link>
          </Button>
        </div>
      </div>

      <LinksManager pageId={page.id} />
    </main>
  );
}
