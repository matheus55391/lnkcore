"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { updatePage } from "@/actions/pages/update-page";
import { pageQueryKey } from "@/queries/use-page-query";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";
import type { Page } from "@/@types";

type Props = {
  page: Pick<Page, "id" | "title" | "themeId">;
};

export function ThemeGrid({ page }: Props) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  async function handleSelect(themeId: number) {
    if (themeId === page.themeId || pendingId !== null) return;

    setPendingId(themeId);
    try {
      const result = await updatePage({
        id: page.id,
        title: page.title,
        themeId,
      });

      if (!result.success) {
        toast.error(result.error ?? "Não foi possível aplicar o tema.");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: pageQueryKey(page.id) });
    } catch {
      toast.error("Não foi possível aplicar o tema.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {THEMES.map((theme) => {
        const isSelected = page.themeId === theme.id;
        const isPending = pendingId === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => {
              void handleSelect(theme.id);
            }}
            disabled={pendingId !== null}
            className={cn(
              "relative overflow-hidden rounded-2xl border-2 text-left transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
            )}
            style={{
              borderColor: isSelected ? theme.accent : theme.cardBorder,
            }}
          >
            <div
              className="flex h-28 flex-col items-center justify-center gap-2 px-3"
              style={{ background: theme.background }}
            >
              <div
                className="size-10 rounded-full"
                style={{ background: theme.accent }}
              />
              <div
                className="h-1.5 w-2/3 rounded-full"
                style={{ background: theme.foreground, opacity: 0.7 }}
              />
              <div
                className="h-7 w-full rounded-xl border"
                style={{
                  background: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              />
            </div>
            <div
              className="flex items-center justify-between px-3 py-2 text-xs font-medium"
              style={{
                background: theme.cardBg,
                color: theme.foreground,
                borderTop: `1px solid ${theme.cardBorder}`,
              }}
            >
              <span className="truncate">{theme.name}</span>
              {isPending ? (
                <Loader2Icon className="size-3.5 shrink-0 animate-spin" />
              ) : isSelected ? (
                <CheckIcon
                  className="size-3.5 shrink-0"
                  style={{ color: theme.accent }}
                />
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
