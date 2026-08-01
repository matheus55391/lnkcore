"use client";

import { Loader2Icon } from "lucide-react";

import { useLinks } from "@/queries/use-links-query";
import { useDeleteLinkMutation } from "@/queries/use-delete-link-mutation";
import { CreateLinkDialog } from "./create-link-dialog";
import { LinkManagerItem } from "./link-manager-item";

type Props = { pageId: string };

export function LinksManager({ pageId }: Props) {
  const { data: links, isLoading } = useLinks(pageId);
  const deleteMutation = useDeleteLinkMutation({ pageId });
  const classicLinks = (links ?? []).filter((l) => l.type !== "SOCIAL");

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
        <h2 className="text-lg font-semibold">Links</h2>
        <CreateLinkDialog pageId={pageId} />
      </div>

      {classicLinks.length === 0 ? (
        <p className="text-muted-foreground text-sm rounded-lg border border-dashed py-10 text-center">
          Nenhum link ainda. Clique em “Novo link” para criar.
        </p>
      ) : (
        <ul className="space-y-2">
          {classicLinks.map((link) => (
            <LinkManagerItem
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
