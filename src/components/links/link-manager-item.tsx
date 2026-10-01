"use client";

import { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  MoreVerticalIcon,
  PencilIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Link } from "@/@types/link";
import { useUpdateLinkMutation } from "@/queries/use-update-link-mutation";
import { cn } from "@/lib/utils";
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
  const [editOpen, setEditOpen] = useState(false);
  const updateMutation = useUpdateLinkMutation({ pageId });

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: link.title, url: link.url });
        return;
      } catch {
        // cancelado — fallback abaixo
      }
    }

    try {
      await navigator.clipboard.writeText(link.url);
      toast.success("Link copiado");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  }

  function handleToggleActive() {
    updateMutation.mutate(
      {
        id: link.id,
        title: link.title,
        url: link.url,
        active: !link.active,
      },
      {
        onSuccess: () => {
          toast.success(
            link.active ? "Link ocultado da página" : "Link visível na página"
          );
        },
        onError: (err) => toast.error(err.message),
      }
    );
  }

  return (
    <li
      className={cn(
        "flex items-center justify-between rounded-lg border bg-background px-4 py-3",
        !link.active && "opacity-60"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <LinkManagerItemThumb link={link} />
        <div className="min-w-0">
          <p className="truncate font-medium">
            {link.title}
            {!link.active ? (
              <span className="text-muted-foreground ml-2 text-xs font-normal">
                Oculto
              </span>
            ) : null}
          </p>
          <p className="text-muted-foreground truncate text-xs">{link.url}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 rounded-full"
            aria-label="Abrir menu do link"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <PencilIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              void handleShare();
            }}
          >
            <Share2Icon />
            Compartilhar
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={updateMutation.isPending}
            onSelect={handleToggleActive}
          >
            {link.active ? <EyeOffIcon /> : <EyeIcon />}
            {link.active ? "Ocultar" : "Mostrar"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={deletePending}
            onSelect={() => onDelete(link.id)}
          >
            <Trash2Icon />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditLinkDialog
        link={link}
        pageId={pageId}
        open={editOpen}
        onOpenChange={setEditOpen}
        showTrigger={false}
      />
    </li>
  );
}
