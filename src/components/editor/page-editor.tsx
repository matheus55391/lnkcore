"use client";

import { useState, useSyncExternalStore } from "react";

import type { PageDetail } from "@/actions/pages/get-page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SelectableSocial } from "@/lib/social-platforms";
import { EditorRail } from "./editor-rail";
import { EditorToolbar } from "./editor-toolbar";
import { EditorPhone } from "./editor-phone";
import { ContentPanel } from "./content-panel";
import { ProfilePanel } from "./profile-panel";
import { AppearancePanel } from "./appearance-panel";
import { SharePageDialog } from "./share-page-dialog";
import type { ContentTab, EditorSection } from "./editor-types";

type Props = {
  page: PageDetail;
};

function subscribeNoop() {
  return () => {};
}

export function PageEditor({ page }: Props) {
  const [section, setSection] = useState<EditorSection>("content");
  const [contentTab, setContentTab] = useState<ContentTab>("links");
  const [linkOpen, setLinkOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [initialPlatformId, setInitialPlatformId] = useState<
    SelectableSocial["id"] | null
  >(null);

  const origin = useSyncExternalStore(
    subscribeNoop,
    () => window.location.origin,
    () => ""
  );
  const pageUrl = origin ? `${origin}/${page.slug}` : `/${page.slug}`;

  function handleAddSocial(platformId?: SelectableSocial["id"]) {
    setContentTab("socials");
    setInitialPlatformId(platformId ?? null);
    setSocialOpen(true);
  }

  function handleSocialOpenChange(open: boolean) {
    setSocialOpen(open);
    if (!open) setInitialPlatformId(null);
  }

  function handleEditProfile() {
    setSection("profile");
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <EditorToolbar
        slug={page.slug}
        pageUrl={pageUrl}
        onShare={() => setShareOpen(true)}
        onPreview={() => setPreviewOpen(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <EditorRail section={section} onSectionChange={setSection} />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-6 py-8 lg:px-10 lg:py-10">
            {section === "content" ? (
              <ContentPanel
                page={page}
                contentTab={contentTab}
                onContentTabChange={setContentTab}
                onEditProfile={handleEditProfile}
                linkOpen={linkOpen}
                onLinkOpenChange={setLinkOpen}
                socialOpen={socialOpen}
                onSocialOpenChange={handleSocialOpenChange}
                initialPlatformId={initialPlatformId}
                onAddSocial={handleAddSocial}
              />
            ) : null}
            {section === "profile" ? <ProfilePanel page={page} /> : null}
            {section === "appearance" ? (
              <AppearancePanel page={page} />
            ) : null}
          </div>
        </main>

        <aside className="hidden shrink-0 items-center justify-center overflow-hidden py-6 pr-6 pl-4 lg:flex">
          <EditorPhone page={page} />
        </aside>
      </div>

      <SharePageDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        pageTitle={page.title}
        pageSlug={page.slug}
        pageUrl={pageUrl}
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="flex max-h-[90dvh] w-auto max-w-[min(90vw,24rem)] flex-col items-center overflow-hidden sm:max-w-[min(90vw,24rem)]">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <EditorPhone page={page} compact />
        </DialogContent>
      </Dialog>
    </div>
  );
}
