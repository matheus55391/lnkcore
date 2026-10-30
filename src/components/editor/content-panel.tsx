"use client";

import { PlusIcon } from "lucide-react";

import type { Page } from "@/@types";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { LinksManager } from "@/components/links/links-manager";
import { SocialsManager } from "@/components/links/socials-manager";
import { CreateLinkDialog } from "@/components/links/create-link-dialog";
import { CreateSocialDialog } from "@/components/links/create-social-dialog";
import { cn } from "@/lib/utils";
import type { ContentTab } from "./editor-types";
import { SocialIconsRow } from "./social-icons-row";
import type { SelectableSocial } from "@/lib/social-platforms";

type Props = {
  page: Pick<Page, "id" | "title" | "bio" | "image">;
  contentTab: ContentTab;
  onContentTabChange: (tab: ContentTab) => void;
  onEditProfile: () => void;
  linkOpen: boolean;
  onLinkOpenChange: (open: boolean) => void;
  socialOpen: boolean;
  onSocialOpenChange: (open: boolean) => void;
  initialPlatformId: SelectableSocial["id"] | null;
  onAddSocial: (platformId?: SelectableSocial["id"]) => void;
};

const TABS: { id: ContentTab; label: string }[] = [
  { id: "links", label: "Links" },
  { id: "socials", label: "Redes" },
];

export function ContentPanel({
  page,
  contentTab,
  onContentTabChange,
  onEditProfile,
  linkOpen,
  onLinkOpenChange,
  socialOpen,
  onSocialOpenChange,
  initialPlatformId,
  onAddSocial,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <ImageUpload
          pageId={page.id}
          initialImage={page.image}
          size={64}
        />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onEditProfile}
            aria-label="Editar cabeçalho"
            className="group flex w-full min-w-0 cursor-pointer flex-col items-start rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="truncate font-semibold leading-tight underline-offset-2 group-hover:underline">
              {page.title}
            </span>
            <span className="truncate text-sm text-muted-foreground underline-offset-2 group-hover:underline">
              {page.bio ? page.bio : "Adicionar algo sobre você"}
            </span>
          </button>
          <div className="mt-2">
            <SocialIconsRow
              pageId={page.id}
              onAdd={() => onAddSocial()}
              onManage={() => onContentTabChange("socials")}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-5 border-b" role="tablist" aria-label="Tipo de conteúdo">
        {TABS.map((tab) => {
          const selected = contentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`content-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`content-panel-${tab.id}`}
              onClick={() => onContentTabChange(tab.id)}
              className={cn(
                "-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors",
                selected
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {contentTab === "links" ? (
        <div
          className="flex flex-col gap-4"
          role="tabpanel"
          id="content-panel-links"
          aria-labelledby="content-tab-links"
        >
          <Button
            type="button"
            className="h-12 w-full rounded-xl bg-brand text-brand-ink hover:bg-brand/90"
            onClick={() => onLinkOpenChange(true)}
          >
            <PlusIcon data-icon="inline-start" />
            Adicionar link
          </Button>
          <LinksManager
            pageId={page.id}
            hideHeader
            onQuickSocial={onAddSocial}
          />
        </div>
      ) : (
        <div
          className="flex flex-col gap-4"
          role="tabpanel"
          id="content-panel-socials"
          aria-labelledby="content-tab-socials"
        >
          <Button
            type="button"
            className="h-12 w-full rounded-xl bg-brand text-brand-ink hover:bg-brand/90"
            onClick={() => onAddSocial()}
          >
            <PlusIcon data-icon="inline-start" />
            Adicionar rede
          </Button>
          <SocialsManager pageId={page.id} hideHeader />
        </div>
      )}

      <CreateLinkDialog
        pageId={page.id}
        open={linkOpen}
        onOpenChange={onLinkOpenChange}
        showTrigger={false}
      />
      <CreateSocialDialog
        pageId={page.id}
        open={socialOpen}
        onOpenChange={onSocialOpenChange}
        showTrigger={false}
        initialPlatformId={initialPlatformId}
      />
    </div>
  );
}
