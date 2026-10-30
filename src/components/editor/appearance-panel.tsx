"use client";

import type { Page } from "@/@types";
import { LayoutPicker } from "./layout-picker";
import { ThemeGrid } from "./theme-grid";

type Props = {
  page: Pick<Page, "id" | "title" | "themeId" | "layout">;
};

export function AppearancePanel({ page }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Aparência</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Layout e tema da página pública. A mudança aparece na hora no preview.
        </p>
      </div>
      <LayoutPicker page={page} />
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-medium">Tema</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Cores de fundo, texto e botões.
          </p>
        </div>
        <ThemeGrid page={page} />
      </div>
    </div>
  );
}
