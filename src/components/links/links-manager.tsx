"use client";

import { Loader2Icon } from "lucide-react";

import { useLinks } from "@/queries/use-links-query";
import { useDeleteLinkMutation } from "@/queries/use-delete-link-mutation";
import { CreateLinkDialog } from "./create-link-dialog";
import { LinkManagerItem } from "./link-manager-item";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";
import {
  getSelectableSocial,
  type SelectableSocial,
} from "@/lib/social-platforms";

const QUICK_SOCIALS: SelectableSocial["id"][] = [
  "whatsapp",
  "instagram",
  "youtube",
];

type Props = {
  pageId: string;
  hideHeader?: boolean;
  onQuickSocial?: (platformId: SelectableSocial["id"]) => void;
};

export function LinksManager({ pageId, hideHeader, onQuickSocial }: Props) {
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
    <div className="flex flex-col gap-4">
      {hideHeader ? null : (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Links</h2>
          <CreateLinkDialog pageId={pageId} />
        </div>
      )}

      {classicLinks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-card/60 px-4 py-10 text-center">
          <div className="flex" aria-hidden>
            <span className="h-10 w-24 rounded-xl border bg-muted/80 shadow-sm" />
            <span className="-ml-3 h-10 w-24 rounded-xl border bg-muted shadow-sm" />
            <span className="-ml-3 h-10 w-24 rounded-xl border bg-card shadow-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium">Sua bio está vazia</p>
            <p className="text-sm text-muted-foreground">
              Adicione um link para aparecer na sua página.
            </p>
          </div>
          {onQuickSocial ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Ou comece por uma destas redes:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_SOCIALS.map((id) => {
                  const platform = getSelectableSocial(id);
                  if (!platform) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onQuickSocial(id)}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      <SocialPlatformIcon platformId={id} className="size-3.5" />
                      {platform.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
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
