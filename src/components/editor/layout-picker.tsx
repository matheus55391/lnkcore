"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updatePage } from "@/actions/pages/update-page";
import { pageQueryKey } from "@/queries/use-page-query";
import type { Page, PageLayout } from "@/@types";
import { cn } from "@/lib/utils";

type Props = {
  page: Pick<Page, "id" | "title" | "layout">;
};

const OPTIONS: {
  id: PageLayout;
  label: string;
  hint: string;
}[] = [
  {
    id: "CLASSIC",
    label: "Clássico",
    hint: "Foto redonda e links em botão",
  },
  {
    id: "COVER",
    label: "Capa",
    hint: "Foto em tela cheia, no estilo feed",
  },
];

export function LayoutPicker({ page }: Props) {
  const [pending, setPending] = useState<PageLayout | null>(null);
  const queryClient = useQueryClient();

  async function handleSelect(layout: PageLayout) {
    if (layout === page.layout || pending !== null) return;

    setPending(layout);
    try {
      const result = await updatePage({
        id: page.id,
        title: page.title,
        layout,
      });

      if (!result.success) {
        toast.error(result.error ?? "Não foi possível aplicar o layout.");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: pageQueryKey(page.id) });
    } catch {
      toast.error("Não foi possível aplicar o layout.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium">Layout</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Define o cabeçalho, os ícones e o recorte dos links grandes.
        </p>
      </div>
      <div
        role="radiogroup"
        aria-label="Layout da página"
        className="grid grid-cols-2 gap-2"
      >
        {OPTIONS.map((option) => {
          const selected = (page.layout ?? "CLASSIC") === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={pending !== null}
              onClick={() => {
                void handleSelect(option.id);
              }}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-2.5 text-left transition-colors disabled:opacity-70",
                selected
                  ? "border-foreground bg-card shadow-sm"
                  : "border-border bg-muted/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              )}
            >
              <LayoutPreview layout={option.id} selected={selected} />
              <span className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {option.label}
                </span>
                <span className="text-[11px] leading-tight text-muted-foreground">
                  {option.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LayoutPreview({
  layout,
  selected,
}: {
  layout: PageLayout;
  selected: boolean;
}) {
  const fill = selected ? "bg-foreground/20" : "bg-foreground/10";

  if (layout === "COVER") {
    return (
      <span
        className="relative flex h-24 flex-col justify-end overflow-hidden rounded-lg bg-zinc-800"
        aria-hidden
      >
        <span className={cn("absolute inset-0 opacity-70", fill)} />
        <span className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />
        <span className="relative z-10 mx-auto mb-1.5 h-1.5 w-8 rounded-full bg-white/80" />
        <span className="relative z-10 mb-2 flex justify-center gap-1">
          <span className="size-2 rounded-full bg-sky-400" />
          <span className="size-2 rounded-full bg-violet-400" />
          <span className="size-2 rounded-full bg-rose-400" />
        </span>
      </span>
    );
  }

  return (
    <span
      className="flex h-24 flex-col items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-background px-3"
      aria-hidden
    >
      <span className={cn("size-6 rounded-full", fill)} />
      <span className={cn("h-1 w-10 rounded-full", fill)} />
      <span className={cn("h-4 w-full rounded-md", fill)} />
    </span>
  );
}
