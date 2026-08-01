"use client";

import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Link } from "@/@types/link";
import { platformLabelFromUrl } from "@/lib/social-platforms";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";
import { detectSocialPlatform } from "@/lib/social-platforms";
import { EditSocialDialog } from "./edit-social-dialog";

type Props = {
  link: Link;
  pageId: string;
  onDelete: (id: string) => void;
  deletePending?: boolean;
};

export function SocialManagerItem({
  link,
  pageId,
  onDelete,
  deletePending,
}: Props) {
  const platform = detectSocialPlatform(link.url);

  return (
    <li className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="bg-muted flex size-9 shrink-0 aspect-square items-center justify-center rounded-full">
          <SocialPlatformIcon
            platformId={platform.id}
            className="h-4 w-4 text-muted-foreground"
          />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">
            {platformLabelFromUrl(link.url)}
          </p>
          <p className="text-muted-foreground truncate text-xs">{link.url}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <EditSocialDialog link={link} pageId={pageId} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(link.id)}
          disabled={deletePending}
          aria-label="Excluir rede social"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
