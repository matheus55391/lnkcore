"use client";

import type { ClassicLinkStyle } from "@/@types/link";
import { cn } from "@/lib/utils";

type Props = {
  value: ClassicLinkStyle;
  onChange: (next: ClassicLinkStyle) => void;
  disabled?: boolean;
};

const OPTIONS: {
  id: ClassicLinkStyle;
  label: string;
  hint: string;
}[] = [
  {
    id: "CLASSIC",
    label: "Normal",
    hint: "Imagem à esquerda",
  },
  {
    id: "FEATURED",
    label: "Grande",
    hint: "Foto com o título por cima",
  },
];

export function resolveClassicStyle(
  type: string | null | undefined
): ClassicLinkStyle {
  return type === "FEATURED" ? "FEATURED" : "CLASSIC";
}

export function LinkStylePicker({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm font-medium leading-none">Estilo</p>
      <div
        role="radiogroup"
        aria-label="Estilo do link"
        className="grid grid-cols-2 gap-2"
      >
        {OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-2.5 text-left transition-colors",
                selected
                  ? "border-foreground bg-card shadow-sm"
                  : "border-border bg-muted/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              )}
            >
              <StylePreview styleId={option.id} selected={selected} />
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

function StylePreview({
  styleId,
  selected,
}: {
  styleId: ClassicLinkStyle;
  selected: boolean;
}) {
  const fill = selected ? "bg-foreground/15" : "bg-foreground/10";

  if (styleId === "FEATURED") {
    return (
      <span
        className="relative flex h-[3.25rem] flex-col justify-end overflow-hidden rounded-lg bg-zinc-800 p-1.5"
        aria-hidden
      >
        <span className={cn("absolute inset-0 opacity-60", fill)} />
        <span className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent" />
        <span className="relative z-10 mx-auto h-1.5 w-10 rounded-full bg-white/80" />
      </span>
    );
  }

  return (
    <span
      className="flex h-[3.25rem] items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2"
      aria-hidden
    >
      <span className={cn("size-4 shrink-0 rounded-full", fill)} />
      <span className={cn("h-1.5 flex-1 rounded-full", fill)} />
    </span>
  );
}
