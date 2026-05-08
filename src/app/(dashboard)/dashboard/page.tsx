"use client";

import { GlobeIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { CreatePageDialog } from "@/components/pages/create-page-dialog";
import { usePages } from "@/queries/use-pages-query";
import { PageCard } from "@/components/page-card";

export default function DashboardPage() {
  const { data: pages, isLoading } = usePages();

  return (
    <main className="container mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suas páginas</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie as suas páginas aqui.
          </p>
        </div>
        <CreatePageDialog />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !pages || pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center gap-4">
          <GlobeIcon className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Nenhuma página ainda</p>
            <p className="text-muted-foreground text-sm">
              Crie sua primeira página e comece a compartilhar seus links.
            </p>
          </div>
          <CreatePageDialog />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link key={page.id} href={`/dashboard/${page.id}`}>
              <PageCard page={page} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
