"use client";

import { cn } from "@/lib/utils";
import {
  LINK_EMOJI_ICONS,
  LINK_ICON_PRESETS,
  isLinkIconValue,
  toLinkIconValue,
  type LinkIconId,
} from "@/lib/link-adornments";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  /** When true, only the icon grid is rendered (parent provides labels). */
  embedded?: boolean;
};

export function LinkIconPicker({
  value,
  onChange,
  disabled,
  embedded,
}: Props) {
  return (
    <div className={cn(!embedded && "space-y-2.5")}>
      {!embedded && value ? (
        <div className="flex justify-end">
          <button
            type="button"
            className="text-muted-foreground text-xs underline"
            onClick={() => onChange(null)}
            disabled={disabled}
          >
            Remover
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {LINK_ICON_PRESETS.map(({ id, label, Icon }) => {
          const selected = value === toLinkIconValue(id);
          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(toLinkIconValue(id as LinkIconId))}
              className={cn(
                "flex size-9 aspect-square items-center justify-center rounded-full border transition-colors hover:bg-accent",
                selected && "border-primary bg-accent"
              )}
              aria-label={label}
              title={label}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
        {LINK_EMOJI_ICONS.map((emoji) => {
          const selected = value === emoji && !isLinkIconValue(value);
          return (
            <button
              key={emoji}
              type="button"
              disabled={disabled}
              onClick={() => onChange(emoji)}
              className={cn(
                "flex size-9 aspect-square items-center justify-center rounded-full border text-base transition-colors hover:bg-accent",
                selected && "border-primary bg-accent"
              )}
              aria-label={`Ícone ${emoji}`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
