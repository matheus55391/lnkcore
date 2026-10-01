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
import { platformLabelFromUrl } from "@/lib/social-platforms";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";
import { detectSocialPlatform } from "@/lib/social-platforms";
import { useUpdateLinkMutation } from "@/queries/use-update-link-mutation";
import { cn } from "@/lib/utils";
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
  const [editOpen, setEditOpen] = useState(false);
  const platform = detectSocialPlatform(link.url);
  const updateMutation = useUpdateLinkMutation({ pageId });

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: platformLabelFromUrl(link.url),
          url: link.url,
        });
        return;
      } catch {
        // cancelado
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
            link.active
              ? "Rede ocultada da página"
              : "Rede visível na página"
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
        <span className="bg-muted flex size-9 shrink-0 aspect-square items-center justify-center rounded-full">
          <SocialPlatformIcon
            platformId={platform.id}
            className="h-4 w-4 text-muted-foreground"
          />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">
            {platformLabelFromUrl(link.url)}
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
            aria-label="Abrir menu da rede social"
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

      <EditSocialDialog
        link={link}
        pageId={pageId}
        open={editOpen}
        onOpenChange={setEditOpen}
        showTrigger={false}
      />
    </li>
  );
}
