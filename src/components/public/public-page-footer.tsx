"use client";

type Props = {
  pageUrl: string;
  onOpenAbout: () => void;
};

export function PublicPageFooter({ pageUrl, onOpenAbout }: Props) {
  const reportHref = `/denunciar?pagina=${encodeURIComponent(pageUrl)}`;

  return (
    <nav className="sp-footer" aria-label="Informações legais">
      <a href="/privacidade">Privacidade</a>
      <span className="sp-footer-sep" aria-hidden>
        •
      </span>
      <a href={reportHref}>Denunciar</a>
      <span className="sp-footer-sep" aria-hidden>
        •
      </span>
      <button type="button" onClick={onOpenAbout}>
        Sobre esta conta
      </button>
    </nav>
  );
}
