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
import { LinkAdornmentIcon, isLinkIconValue } from "@/lib/link-adornments";

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
  const featured = link.type === "FEATURED";

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

  const menu = (
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
  );

  const dialog = (
    <EditLinkDialog
      link={link}
      pageId={pageId}
      open={editOpen}
      onOpenChange={setEditOpen}
      showTrigger={false}
    />
  );

  const titleBlock = (
    <div className="min-w-0">
      <p className="truncate font-medium">
        {link.title}
        {featured ? (
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            Grande
          </span>
        ) : null}
        {!link.active ? (
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            Oculto
          </span>
        ) : null}
      </p>
      <p className="text-muted-foreground truncate text-xs">{link.url}</p>
    </div>
  );

  if (featured && link.image) {
    return (
      <li
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-card shadow-sm",
          !link.active && "opacity-60"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={link.image}
          alt=""
          className="aspect-[4/5] w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-12">
          <div className="min-w-0 text-white">
            <p className="truncate font-medium">{link.title}</p>
            <p className="truncate text-xs text-white/70">{link.url}</p>
          </div>
          <div className="text-white">{menu}</div>
        </div>
        {dialog}
      </li>
    );
  }

  if (featured) {
    return (
      <li
        className={cn(
          "overflow-hidden rounded-2xl border bg-card p-3 shadow-sm",
          !link.active && "opacity-60"
        )}
      >
        <FeaturedCover link={link} />
        <div
          className={cn(
            "flex items-center justify-between gap-2",
            Boolean(link.emoji) && "pt-3"
          )}
        >
          {titleBlock}
          {menu}
        </div>
        {dialog}
      </li>
    );
  }

  return (
    <li
      className={cn(
        "flex items-center justify-between rounded-2xl border bg-card px-4 py-3.5 shadow-sm",
        !link.active && "opacity-60"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <LinkManagerItemThumb link={link} />
        {titleBlock}
      </div>
      {menu}
      {dialog}
    </li>
  );
}

function FeaturedCover({ link }: { link: Link }) {
  if (link.image) {
    return (
      <div className="overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={link.image}
          alt=""
          className="aspect-[16/10] w-full object-cover"
        />
      </div>
    );
  }

  if (isLinkIconValue(link.emoji)) {
    return (
      <div className="bg-muted flex aspect-[16/9] items-center justify-center rounded-xl">
        <LinkAdornmentIcon
          value={link.emoji}
          className="h-8 w-8 text-muted-foreground"
        />
      </div>
    );
  }

  if (link.emoji) {
    return (
      <div className="bg-muted flex aspect-[16/9] items-center justify-center rounded-xl text-3xl">
        {link.emoji}
      </div>
    );
  }

  return null;
}
