"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckIcon, CopyIcon, ExternalLinkIcon, ShareIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageTitle: string;
  pageSlug: string;
  pageUrl: string;
};

function subscribeNoop() {
  return () => {};
}

function getCanNativeShare() {
  return typeof navigator !== "undefined" && "share" in navigator;
}

export function SharePageDialog({
  open,
  onOpenChange,
  pageTitle,
  pageSlug,
  pageUrl,
}: Props) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribeNoop,
    getCanNativeShare,
    () => false
  );

  const encoded = encodeURIComponent(pageUrl);
  const text = encodeURIComponent(pageTitle);

  const shareTargets = [
    {
      id: "whatsapp" as const,
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${pageTitle} ${pageUrl}`)}`,
    },
    {
      id: "x" as const,
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
    },
    {
      id: "facebook" as const,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      toast.success("Link copiado");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: pageTitle, url: pageUrl });
    } catch {
      // cancelled
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar bio</DialogTitle>
          <DialogDescription>
            makebio.com.br/{pageSlug}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2">
            <p className="min-w-0 flex-1 truncate text-sm">{pageUrl}</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                void handleCopy();
              }}
            >
              {copied ? (
                <CheckIcon data-icon="inline-start" />
              ) : (
                <CopyIcon data-icon="inline-start" />
              )}
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {canNativeShare ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void handleNativeShare();
                }}
              >
                <ShareIcon data-icon="inline-start" />
                Enviar
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon data-icon="inline-start" />
                Abrir página
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {shareTargets.map((target) => (
              <Button key={target.id} asChild variant="outline" size="sm">
                <a href={target.href} target="_blank" rel="noopener noreferrer">
                  <SocialPlatformIcon
                    platformId={target.id}
                    className="size-4"
                  />
                  {target.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
