"use client";

import Link from "next/link";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { use } from "react";

import { Button } from "@/components/ui/button";
import { usePage } from "@/queries/use-page-query";
import { PageEditor } from "@/components/editor/page-editor";

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

  return <PageEditor page={page} />;
}
