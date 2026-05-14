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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolher tema</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          {THEMES.map((theme) => {
            const isSelected = selected === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelected(theme.id)}
                className="relative rounded-xl overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  borderColor: isSelected ? theme.accent : theme.cardBorder,
                }}
              >
                {/* Preview */}
                <div
                  className="h-20 flex flex-col items-center justify-center gap-1.5 px-3"
                  style={{ background: theme.background }}
                >
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ background: theme.accent }}
                  />
                  <div
                    className="w-3/4 h-2 rounded-full"
                    style={{ background: theme.foreground, opacity: 0.6 }}
                  />
                  <div
                    className="w-full h-6 rounded-md border"
                    style={{
                      background: theme.cardBg,
                      borderColor: theme.cardBorder,
                    }}
                  />
                </div>

                {/* Label */}
                <div
                  className="flex items-center justify-between px-2.5 py-1.5 text-xs font-medium"
                  style={{
                    background: theme.cardBg,
                    color: theme.foreground,
                    borderTop: `1px solid ${theme.cardBorder}`,
                  }}
                >
                  {theme.name}
                  {isSelected && (
                    <CheckIcon
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: theme.accent }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || selected === page.themeId}
          >
            {saving && <Loader2Icon className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
