"use client";

import { useState, useSyncExternalStore } from "react";
import { getTheme } from "@/lib/themes";
import type { Page } from "@/@types";
import { getSlugPageStyles } from "@/components/public/slug-page-styles";
import { PublicShareButton } from "@/components/public/public-share-button";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicSocialRow } from "@/components/public/public-social-row";
import { PublicLinksList } from "@/components/public/public-links-list";
import { PublicPageFooter } from "@/components/public/public-page-footer";
import { ShareModal } from "@/components/public/share-modal";
import { AboutAccountModal } from "@/components/public/about-account-modal";

type Props = { page: Page; preview?: boolean };

function subscribeNoop() {
  return () => {};
}

function usePageUrl(slug: string) {
  const origin = useSyncExternalStore(
    subscribeNoop,
    () => window.location.origin,
    () => ""
  );
  return origin ? `${origin}/${slug}` : `/${slug}`;
}

export function SlugPageView({ page, preview = false }: Props) {
  const theme = getTheme(page.themeId);
  const scope = `sp-${page.id}`;
  const [shareOpen, setShareOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const cover = (page.layout ?? "CLASSIC") === "COVER";

  const pageUrl = usePageUrl(page.slug);

  const classicLinks = (page.links ?? []).filter((l) => l.type !== "SOCIAL");
  const socialLinks = (page.links ?? []).filter((l) => l.type === "SOCIAL");

  const socials = (
    <PublicSocialRow
      links={socialLinks}
      color={theme.foreground}
      variant={cover ? "brand" : "plain"}
    />
  );

  return (
    <div
      id={scope}
      data-preview={preview ? "true" : undefined}
      data-layout={page.layout ?? "CLASSIC"}
    >
      <style>{getSlugPageStyles(scope, theme)}</style>

      <PublicShareButton onClick={() => setShareOpen(true)} />

      {cover ? (
        <>
          <PublicPageHeader
            title={page.title}
            bio={page.bio}
            image={page.image}
            slug={page.slug}
            layout="COVER"
            socials={socials}
          />
          <div className="sp-inner">
            {page.bio ? <p className="sp-bio">{page.bio}</p> : null}
            <PublicLinksList links={classicLinks} />
          </div>
        </>
      ) : (
        <div className="sp-inner">
          <PublicPageHeader
            title={page.title}
            bio={page.bio}
            image={page.image}
            slug={page.slug}
            layout="CLASSIC"
          />
          {socials}
          <PublicLinksList links={classicLinks} />
        </div>
      )}

      <PublicPageFooter
        pageUrl={pageUrl}
        onOpenAbout={() => setAboutOpen(true)}
      />

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        pageTitle={page.title}
        pageImage={page.image}
        pageSlug={page.slug}
        pageUrl={pageUrl}
        foreground={theme.foreground}
        background={theme.background}
      />
      <AboutAccountModal
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        pageTitle={page.title}
        pageSlug={page.slug}
        pageImage={page.image}
        joinedAt={page.createdAt}
        socialLinks={socialLinks}
      />
    </div>
  );
}
