"use client";

import { PlusIcon } from "lucide-react";

import { useLinks } from "@/queries/use-links-query";
import { detectSocialPlatform } from "@/lib/social-platforms";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";
import { cn } from "@/lib/utils";

type Props = {
  pageId: string;
  onAdd: () => void;
  onManage: () => void;
};

export function SocialIconsRow({ pageId, onAdd, onManage }: Props) {
  const { data: links } = useLinks(pageId);
  const socials = (links ?? []).filter((link) => link.type === "SOCIAL");

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {socials.map((link) => {
        const platform = detectSocialPlatform(link.url);
        return (
          <button
            key={link.id}
            type="button"
            title={platform.label}
            onClick={onManage}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              !link.active && "opacity-40"
            )}
          >
            <SocialPlatformIcon platformId={platform.id} className="size-3.5" />
          </button>
        );
      })}
      <button
        type="button"
        onClick={onAdd}
        title="Adicionar rede social"
        aria-label="Adicionar rede social"
        className="flex size-8 items-center justify-center rounded-full border border-dashed text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
      >
        <PlusIcon className="size-3.5" />
      </button>
    </div>
  );
}
