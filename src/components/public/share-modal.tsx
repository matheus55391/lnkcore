"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Share, X } from "lucide-react";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";
import { useEscapeKey } from "@/hooks/use-escape-key";

type Props = {
  open: boolean;
  onClose: () => void;
  pageTitle: string;
  pageImage: string | null;
  pageSlug: string;
  pageUrl: string;
  foreground: string;
  background: string;
};

function subscribeNoop() {
  return () => {};
}

function getCanNativeShare() {
  return typeof navigator !== "undefined" && "share" in navigator;
}

type ShareModalContentProps = Omit<Props, "open">;

function ShareModalContent({
  onClose,
  pageTitle,
  pageImage,
  pageSlug,
  pageUrl,
  foreground,
  background,
}: ShareModalContentProps) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribeNoop,
    getCanNativeShare,
    () => false
  );

  useEscapeKey(onClose);

  const encoded = encodeURIComponent(pageUrl);
  const text = encodeURIComponent(pageTitle);

  const shareTargets = [
    {
      id: "x" as const,
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
      bg: "#000000",
    },
    {
      id: "facebook" as const,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      bg: "#1877F2",
    },
    {
      id: "whatsapp" as const,
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${pageTitle} ${pageUrl}`)}`,
      bg: "#25D366",
    },
    {
      id: "linkedin" as const,
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      bg: "#0A66C2",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
    } catch {
      // ignore
    }
  }

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: pageTitle, url: pageUrl });
    } catch {
      // user cancelled
    }
  }

  return (
    <div className="sp-modal-root" role="presentation" onClick={onClose}>
      <div
        className="sp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sp-modal-header">
          <h2 id="share-modal-title">Compartilhar</h2>
          <button
            type="button"
            className="sp-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="sp-share-preview"
          style={{ backgroundColor: background, color: foreground }}
        >
          {pageImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pageImage} alt="" className="sp-share-avatar" />
          ) : (
            <div className="sp-share-avatar sp-share-avatar-empty" />
          )}
          <p className="sp-share-title">{pageTitle}</p>
          <p className="sp-share-handle">/{pageSlug}</p>
        </div>

        <div className="sp-share-row">
          <button
            type="button"
            className="sp-share-circle"
            onClick={copyLink}
            aria-label="Copiar link"
          >
            <span
              className="sp-share-circle-icon"
              style={{ background: "#e5e5e5" }}
            >
              {copied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </span>
            <span className="sp-share-circle-label">
              {copied ? "Copiado" : "Copiar"}
            </span>
          </button>

          {canNativeShare && (
            <button
              type="button"
              className="sp-share-circle"
              onClick={nativeShare}
              aria-label="Compartilhar"
            >
              <span
                className="sp-share-circle-icon"
                style={{ background: "#111", color: "#fff" }}
              >
                <Share className="h-5 w-5" />
              </span>
              <span className="sp-share-circle-label">Share</span>
            </button>
          )}

          {shareTargets.map((t) => (
            <a
              key={t.id}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-share-circle"
            >
              <span
                className="sp-share-circle-icon"
                style={{ background: t.bg, color: "#fff" }}
              >
                <SocialPlatformIcon
                  platformId={t.id}
                  className="h-5 w-5"
                  color="#fff"
                />
              </span>
              <span className="sp-share-circle-label">{t.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShareModal({ open, ...props }: Props) {
  if (!open) return null;
  return <ShareModalContent {...props} />;
}
