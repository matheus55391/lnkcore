"use client";

import { Loader2Icon } from "lucide-react";

import { useLinks } from "@/queries/use-links-query";
import { useDeleteLinkMutation } from "@/queries/use-delete-link-mutation";
import { CreateSocialDialog } from "./create-social-dialog";
import { SocialManagerItem } from "./social-manager-item";

type Props = { pageId: string };

export function SocialsManager({ pageId }: Props) {
  const { data: links, isLoading } = useLinks(pageId);
  const deleteMutation = useDeleteLinkMutation({ pageId });
  const socialLinks = (links ?? []).filter((l) => l.type === "SOCIAL");

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Redes sociais</h2>
          <p className="text-muted-foreground text-xs">
            Ícones das redes na página pública.
          </p>
        </div>
        <CreateSocialDialog pageId={pageId} />
      </div>

      {socialLinks.length === 0 ? (
        <p className="text-muted-foreground text-sm rounded-lg border border-dashed py-10 text-center">
          Nenhuma rede ainda. Clique em “Nova rede” para adicionar.
        </p>
      ) : (
        <ul className="space-y-2">
          {socialLinks.map((link) => (
            <SocialManagerItem
              key={link.id}
              link={link}
              pageId={pageId}
              onDelete={(id) => deleteMutation.mutate(id)}
              deletePending={deleteMutation.isPending}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
