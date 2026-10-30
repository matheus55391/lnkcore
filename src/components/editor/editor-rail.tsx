"use client";

import { Link2Icon, PaletteIcon, PanelTopIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EditorSection } from "./editor-types";

const ITEMS: {
  id: EditorSection;
  label: string;
  hint: string;
  icon: typeof Link2Icon;
}[] = [
  {
    id: "content",
    label: "Links",
    hint: "Links e redes",
    icon: Link2Icon,
  },
  {
    id: "profile",
    label: "Cabeçalho",
    hint: "Foto, título e bio",
    icon: PanelTopIcon,
  },
  {
    id: "appearance",
    label: "Aparência",
    hint: "Tema da página",
    icon: PaletteIcon,
  },
];

type Props = {
  section: EditorSection;
  onSectionChange: (section: EditorSection) => void;
};

export function EditorRail({ section, onSectionChange }: Props) {
  return (
    <nav
      aria-label="Seções do editor"
      className="flex shrink-0 gap-1 overflow-x-auto border-b bg-card px-2 py-2 sm:px-3 lg:w-52 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:border-r lg:px-3 lg:py-6"
    >
      {ITEMS.map((item) => {
        const selected = section === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
              selected
                ? "bg-brand text-brand-ink"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold leading-tight">
                {item.label}
              </span>
              <span
                className={cn(
                  "hidden text-xs leading-tight lg:block",
                  selected ? "text-brand-ink/70" : "text-muted-foreground"
                )}
              >
                {item.hint}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
