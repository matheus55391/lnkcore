"use client";

import Link from "next/link";

type Props = {
  pageUrl: string;
  onOpenAbout: () => void;
};

export function PublicPageFooter({ pageUrl, onOpenAbout }: Props) {
  const reportHref = `/denunciar?pagina=${encodeURIComponent(pageUrl)}`;

  return (
    <nav className="sp-footer" aria-label="Informações legais">
      <Link href="/termos">Termos</Link>
      <Link href="/privacidade">Privacidade</Link>
      <Link href={reportHref}>Denunciar</Link>
      <button type="button" onClick={onOpenAbout}>
        Sobre esta conta
      </button>
    </nav>
  );
}
