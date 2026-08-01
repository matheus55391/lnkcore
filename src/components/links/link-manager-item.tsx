"use client";

import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Link } from "@/@types/link";
import { EditLinkDialog } from "./edit-link-dialog";
import { LinkManagerItemThumb } from "./link-manager-item-thumb";

type Props = {
  link: Link;
  pageId: string;
  onDelete: (id: string) => void;
  deletePending?: boolean;
};

export function LinkManagerItem({
  link,
  pageId,
  onDelete,
  deletePending,
}: Props) {
  return (
    <li className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <LinkManagerItemThumb link={link} />
        <div className="min-w-0">
          <p className="truncate font-medium">{link.title}</p>
          <p className="text-muted-foreground truncate text-xs">{link.url}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <EditLinkDialog link={link} pageId={pageId} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(link.id)}
          disabled={deletePending}
          aria-label="Excluir link"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
