"use client";

import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, Loader2Icon } from "lucide-react";
import { use } from "react";

import { Button } from "@/components/ui/button";
import { LinksManager } from "@/components/links/links-manager";
import { usePage } from "@/queries/use-page-query";
import { SlugPageView } from "@/components/page-slug-view";
import { ImageUpload } from "@/components/image-upload";
import { EditPageInfoDialog } from "@/components/pages/edit-page-info-dialog";
import { ThemePickerDialog } from "@/components/pages/theme-picker-dialog";

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
    <div className="flex flex-col lg:flex-row min-h-0">
      {/* Main content */}
      <main className="flex-1 min-w-0 container mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
            <Link href="/dashboard">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Profile row */}
            <div className="flex items-center gap-3 min-w-0">
              <ImageUpload pageId={page.id} initialImage={page.image} />
              <div className="min-w-0">
                <EditPageInfoDialog page={page} />
                <p className="text-muted-foreground text-xs truncate mt-0.5">
                  makebio.com.br/{page.slug}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <ThemePickerDialog page={page} />

              <Button asChild variant="outline" size="sm">
                <Link href={`/${page.slug}`} target="_blank">
                  <ExternalLinkIcon className="h-3.5 w-3.5 mr-1" />
                  Ver página
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <LinksManager pageId={page.id} />
      </main>

      {/* Phone preview — only shown on lg+ */}
      <aside className="hidden lg:flex lg:items-start lg:justify-center lg:px-8 lg:py-8">
        <div
          className="w-[320px] h-160 rounded-[2.5rem] overflow-hidden border border-border shadow-xl"
        >
          <SlugPageView page={page} />
        </div>
      </aside>
    </div>
  );
}
