"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PaletteIcon, CheckIcon, Loader2Icon } from "lucide-react";

import { updatePage } from "@/actions/pages/update-page";
import { pageQueryKey } from "@/queries/use-page-query";
import { THEMES } from "@/lib/themes";
import type { Page } from "@/@types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  page: Pick<Page, "id" | "title" | "themeId">;
};

export function ThemePickerDialog({ page }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(page.themeId);
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) setSelected(page.themeId);
  }

  async function handleSave() {
    if (selected === page.themeId) {
      setOpen(false);
      return;
    }

    setSaving(true);
    try {
      const result = await updatePage({
        id: page.id,
        title: page.title,
        themeId: selected,
      });

      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: pageQueryKey(page.id) });
        setOpen(false);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shrink-0">
          <PaletteIcon className="h-3.5 w-3.5 mr-1" />
          Tema
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Escolher tema</DialogTitle>
        </DialogHeader>

        {/* Scroll */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-2">
            {THEMES.map((theme) => {
              const isSelected = selected === theme.id;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelected(theme.id)}
                  className="
                  relative overflow-hidden rounded-2xl border-2
                  transition-all duration-200
                  hover:scale-[1.02] hover:shadow-lg
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                "
                  style={{
                    borderColor: isSelected
                      ? theme.accent
                      : theme.cardBorder,
                  }}
                >
                  {/* Preview */}
                  <div
                    className="h-32 flex flex-col items-center justify-center gap-2 px-3"
                    style={{
                      background: theme.background,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full"
                      style={{
                        background: theme.accent,
                      }}
                    />

                    <div
                      className="w-2/3 h-2 rounded-full"
                      style={{
                        background: theme.foreground,
                        opacity: 0.7,
                      }}
                    />

                    <div
                      className="w-full h-8 rounded-xl border"
                      style={{
                        background: theme.cardBg,
                        borderColor: theme.cardBorder,
                      }}
                    />
                  </div>

                  {/* Label */}
                  <div
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium"
                    style={{
                      background: theme.cardBg,
                      color: theme.foreground,
                      borderTop: `1px solid ${theme.cardBorder}`,
                    }}
                  >
                    <span className="truncate">
                      {theme.name}
                    </span>

                    {isSelected && (
                      <CheckIcon
                        className="h-4 w-4 shrink-0"
                        style={{
                          color: theme.accent,
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t pt-4 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || selected === page.themeId}
          >
            {saving && (
              <Loader2Icon className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            )}

            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}