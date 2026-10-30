"use client";

import { Loader2Icon } from "lucide-react";

import { useLinks } from "@/queries/use-links-query";
import { useDeleteLinkMutation } from "@/queries/use-delete-link-mutation";
import { CreateSocialDialog } from "./create-social-dialog";
import { SocialManagerItem } from "./social-manager-item";

type Props = {
  pageId: string;
  hideHeader?: boolean;
};

export function SocialsManager({ pageId, hideHeader }: Props) {
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
    <div className="flex flex-col gap-4">
      {hideHeader ? null : (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Redes sociais</h2>
            <p className="text-xs text-muted-foreground">
              Ícones das redes na página pública.
            </p>
          </div>
          <CreateSocialDialog pageId={pageId} />
        </div>
      )}

      {socialLinks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed bg-card/60 px-4 py-10 text-center">
          <p className="font-medium">Nenhuma rede ainda</p>
          <p className="text-sm text-muted-foreground">
            Os ícones aparecem abaixo da bio, na página pública.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
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
