/**
 * Decorative phone mock of a public MakeBio page.
 * Pure presentational — not interactive.
 */
export function BioMock({ className = "" }: { className?: string }) {
  return (
    <div className={`lp-phone ${className}`} aria-hidden="true">
      <div className="lp-phone-bezel">
        <div className="lp-phone-notch" />
        <div className="lp-phone-screen">
          <div className="lp-mock-avatar" />
          <p className="lp-mock-name">ana.cria</p>
          <p className="lp-mock-bio">conteúdo, cursos e o que estou lançando</p>
          <div className="lp-mock-links">
            <span>Instagram</span>
            <span>YouTube</span>
            <span>Loja</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
