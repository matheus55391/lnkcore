"use client";

import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, ShareIcon, SmartphoneIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile-avatar";
import { useCurrentUser } from "@/queries/use-current-user-query";

type Props = {
  slug: string;
  pageUrl: string;
  onShare: () => void;
  onPreview: () => void;
};

export function EditorToolbar({ slug, pageUrl, onShare, onPreview }: Props) {
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b bg-card px-3 py-2.5 sm:px-4">
      <div className="flex min-w-0 items-center gap-1">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard">
            <ArrowLeftIcon data-icon="inline-start" />
            Voltar
          </Link>
        </Button>
        <p className="hidden truncate text-sm text-muted-foreground sm:block">
          makebio.com.br/{slug}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={onPreview}
        >
          <SmartphoneIcon data-icon="inline-start" />
          Preview
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onShare}>
          <ShareIcon data-icon="inline-start" />
          <span className="hidden sm:inline">Compartilhar</span>
        </Button>
        <Button asChild size="sm">
          <a href={pageUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon data-icon="inline-start" />
            Ver página
          </a>
        </Button>
        {currentUser ? <ProfileAvatar user={currentUser} /> : null}
      </div>
    </div>
  );
}
