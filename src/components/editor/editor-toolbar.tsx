"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  ShareIcon,
  SmartphoneIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile-avatar";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/queries/use-current-user-query";

type Props = {
  slug: string;
  pageUrl: string;
  onShare: () => void;
  onPreview: () => void;
};

const actionClassName =
  "size-9 shrink-0 px-0 sm:h-9 sm:w-auto sm:px-3";

export function EditorToolbar({ slug, pageUrl, onShare, onPreview }: Props) {
  const { data: currentUser } = useCurrentUser();

  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b bg-card px-2 py-2 sm:px-4">
      <div className="flex min-w-0 items-center gap-1">
        <Button asChild variant="ghost" size="sm" className={cn(actionClassName, "-ml-0.5")}>
          <Link href="/dashboard" aria-label="Voltar ao dashboard">
            <ArrowLeftIcon />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
        </Button>
        <p className="hidden min-w-0 truncate text-sm text-muted-foreground md:block">
          makebio.com.br/{slug}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(actionClassName, "lg:hidden")}
          onClick={onPreview}
          aria-label="Preview"
        >
          <SmartphoneIcon />
          <span className="hidden sm:inline">Preview</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={actionClassName}
          onClick={onShare}
          aria-label="Compartilhar"
        >
          <ShareIcon />
          <span className="hidden sm:inline">Compartilhar</span>
        </Button>
        <Button asChild size="sm" className={actionClassName}>
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver página"
          >
            <ExternalLinkIcon />
            <span className="hidden sm:inline">Ver página</span>
          </a>
        </Button>
        {currentUser ? (
          <ProfileAvatar user={currentUser} className="size-9" />
        ) : null}
      </div>
    </header>
  );
}
