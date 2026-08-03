"use client";

import { Calendar, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { detectSocialPlatform } from "@/lib/social-platforms";
import type { Link } from "@/@types";

type Props = {
  open: boolean;
  onClose: () => void;
  pageTitle: string;
  pageSlug: string;
  pageImage: string | null;
  joinedAt: Date | string;
  socialLinks: Link[];
};

type ContentProps = Omit<Props, "open">;

function formatJoinedMonth(date: Date) {
  const raw = format(date, "MMMM 'de' yyyy", { locale: ptBR });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function membershipYears(joined: Date) {
  const now = new Date();
  let years = now.getFullYear() - joined.getFullYear();
  const monthDiff = now.getMonth() - joined.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < joined.getDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}

function AboutAccountModalContent({
  onClose,
  pageTitle,
  pageSlug,
  pageImage,
  joinedAt,
  socialLinks,
}: ContentProps) {
  useEscapeKey(onClose);

  const joined = typeof joinedAt === "string" ? new Date(joinedAt) : joinedAt;
  const years = membershipYears(joined);
  const joinedLabel = formatJoinedMonth(joined);
  const socialLabels = [
    ...new Set(
      socialLinks.map((l) => detectSocialPlatform(l.url).label)
    ),
  ];

  const yearsText =
    years <= 0
      ? "há menos de um ano"
      : years === 1
        ? "há 1 ano"
        : `há ${years} anos`;

  return (
    <div className="sp-modal-root" role="presentation" onClick={onClose}>
      <div
        className="sp-modal sp-modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sp-modal-header sp-about-header">
          <h2 id="about-modal-title">Sobre esta conta</h2>
          <button
            type="button"
            className="sp-modal-close sp-about-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="sp-about-profile">
          {pageImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pageImage} alt="" className="sp-about-avatar" />
          ) : (
            <div className="sp-about-avatar sp-about-avatar-empty" />
          )}
          <p className="sp-about-name">{pageTitle || pageSlug}</p>
          <p className="sp-about-intro">
            Para ajudar a manter a comunidade autêntica, mostramos informações
            sobre contas no MakeBio.
          </p>
        </div>

        <hr className="sp-about-divider" />

        <div className="sp-about-body">
          <div className="sp-about-joined">
            <Calendar className="h-4 w-4 shrink-0" aria-hidden />
            <p className="sp-about-joined-label">
              <strong>Entrou em</strong> {joinedLabel}
            </p>
          </div>

          <p className="sp-about-text">
            <strong>{pageTitle || pageSlug}</strong> é membro do MakeBio{" "}
            {yearsText} e entrou em {joinedLabel}.
          </p>

          {socialLabels.length > 0 ? (
            <>
              <p className="sp-about-text">
                As redes sociais vinculadas a partir desta página são:
              </p>
              <ul className="sp-about-socials">
                {socialLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="sp-about-text">
              Esta página ainda não vinculou redes sociais como ícones.
            </p>
          )}

          <a href="/privacidade" className="sp-about-more">
            Leia mais…
          </a>
        </div>
      </div>
    </div>
  );
}

export function AboutAccountModal({ open, ...props }: Props) {
  if (!open) return null;
  return <AboutAccountModalContent {...props} />;
}
