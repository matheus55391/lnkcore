import Link from "next/link";
import {
  ArrowRight,
  Check,
  GripVertical,
  Palette,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoTheme } from "@/components/logo-theme";
import { BioMock } from "@/components/landing/bio-mock";
import { PLAN_LIMITS } from "@/lib/plan-limits";

type Props = {
  signedIn: boolean;
  userLabel: string | null;
};

const HOW_STEPS = [
  {
    step: "01",
    title: "Crie sua conta",
    description:
      "Cadastro rápido com e-mail. Sem cartão para começar no plano gratuito.",
  },
  {
    step: "02",
    title: "Monte sua página",
    description:
      "Escolha um tema, adicione foto, bio e os links que importam — Instagram, loja, WhatsApp.",
  },
  {
    step: "03",
    title: "Compartilhe o link",
    description:
      "Coloque makebio.com.br/seunome na bio e concentre o tráfego num só endereço.",
  },
] as const;

const FEATURES = [
  {
    icon: <Palette className="h-5 w-5" />,
    title: "Temas prontos",
    description:
      "Doze estilos — claro, escuro, neon, editorial. Troque com um clique e sua página pública acompanha na hora.",
  },
  {
    icon: <GripVertical className="h-5 w-5" />,
    title: "Editor direto",
    description:
      "Arraste para reordenar, ative ou desative links, suba imagens. Sem código, sem planilha.",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Mais de uma página",
    description:
      "No PRO você gerencia até 5 páginas distintas — marcas, projetos ou personas diferentes no mesmo login.",
  },
] as const;

const FAQS = [
  {
    q: "O que é um link na bio?",
    a: "É uma página única com todos os seus links importantes. Você coloca um só endereço na bio do Instagram, TikTok ou YouTube e quem clica encontra tudo organizado.",
  },
  {
    q: "O MakeBio é gratuito?",
    a: `Sim. O plano gratuito inclui 1 página, até ${PLAN_LIMITS.FREE.maxLinksPerPage} links e upload de imagens. O PRO amplia limites para quem precisa de mais páginas e links.`,
  },
  {
    q: "Posso personalizar a aparência?",
    a: "Sim. Cada página tem tema próprio (cores de fundo, cartões e acentos). Você também define título, bio e foto de perfil.",
  },
  {
    q: "Como coloco na bio do Instagram?",
    a: "Depois de criar e publicar, copie o endereço makebio.com.br/seu-slug e cole em Editar perfil → Site / Link. O mesmo link funciona no TikTok, YouTube e outras redes.",
  },
  {
    q: "Em que o MakeBio difere do Linktree?",
    a: "É uma alternativa brasileira, em português, com domínio .com.br, temas próprios e planos pensados para quem está começando — sem a complexidade de hubs de monetização internacionais.",
  },
] as const;

export function LandingView({ signedIn, userLabel }: Props) {
  const primaryHref = signedIn ? "/dashboard" : "/sign-up";
  const primaryLabel = signedIn ? "Ir ao painel" : "Criar conta grátis";

  return (
    <div className="lp">
      <header className="lp-header">
        <div className="lp-shell lp-header-inner">
          <Link href="/" className="lp-brand">
            <LogoTheme force="light" />
            <span>MakeBio</span>
          </Link>
          <nav className="lp-nav" aria-label="Seções">
            <a href="#como-funciona">Como funciona</a>
            <a href="#recursos">Recursos</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="lp-header-actions">
            {userLabel ? (
              <span className="lp-user-label">{userLabel}</span>
            ) : null}
            <Button asChild variant="ghost" size="sm" className="lp-btn-ghost">
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button asChild size="sm" className="lp-btn-primary">
              <Link href={primaryHref}>
                {signedIn ? "Painel" : "Começar"}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — brand + one line + CTA + dominant mock */}
        <section className="lp-hero">
          <div className="lp-hero-glow" aria-hidden="true" />
          <div className="lp-shell lp-hero-grid">
            <div className="lp-hero-copy">
              <p className="lp-brand-mark">MakeBio</p>
              <h1 className="lp-hero-title">
                Seu link na bio,
                <br />
                do seu jeito.
              </h1>
              <p className="lp-hero-lead">
                Reúna Instagram, TikTok, loja e WhatsApp em um único endereço
                brasileiro — rápido de montar, fácil de compartilhar.
              </p>
              <div className="lp-hero-cta">
                <Button asChild size="lg" className="lp-btn-primary">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                {!signedIn ? (
                  <Button asChild size="lg" variant="outline" className="lp-btn-outline">
                    <Link href="/sign-in">Já tenho conta</Link>
                  </Button>
                ) : null}
              </div>
              <p className="lp-hero-url">
                makebio.com.br/<span>seunome</span>
              </p>
            </div>
            <div className="lp-hero-visual">
              <BioMock />
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section className="lp-platforms" aria-label="Redes suportadas">
          <div className="lp-shell lp-platforms-inner">
            <p>Feito para quem vive na bio do</p>
            <ul>
              <li>
                <InstagramIcon /> Instagram
              </li>
              <li>
                <TikTokIcon /> TikTok
              </li>
              <li>
                <YoutubeIcon /> YouTube
              </li>
              <li>
                <WhatsAppIcon /> WhatsApp
              </li>
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="lp-section">
          <div className="lp-shell">
            <header className="lp-section-head">
              <h2>Do zero à bio em três passos</h2>
              <p>
                Sem templates confusos. Você cria, publica e cola o link na
                rede.
              </p>
            </header>
            <ol className="lp-steps">
              {HOW_STEPS.map((item) => (
                <li key={item.step}>
                  <span className="lp-step-num">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section id="recursos" className="lp-section lp-section-alt">
          <div className="lp-shell">
            <header className="lp-section-head">
              <h2>Tudo que você precisa no link</h2>
              <p>
                Foco no essencial: página pública bonita, editor simples e
                limites claros por plano.
              </p>
            </header>
            <div className="lp-features">
              {FEATURES.map((f) => (
                <article key={f.title} className="lp-feature">
                  <div className="lp-feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="planos" className="lp-section">
          <div className="lp-shell">
            <header className="lp-section-head">
              <h2>Comece grátis. Escalone quando precisar.</h2>
              <p>
                Sem surpresa: o gratuito já publica. O PRO libera mais páginas,
                links e imagens.
              </p>
            </header>
            <div className="lp-pricing">
              <PricingCard
                name="Free"
                tagline="Para começar agora"
                href={primaryHref}
                cta={signedIn ? "Abrir painel" : "Criar conta grátis"}
                features={[
                  `${PLAN_LIMITS.FREE.maxPages} página pública`,
                  `Até ${PLAN_LIMITS.FREE.maxLinksPerPage} links`,
                  `Até ${PLAN_LIMITS.FREE.maxStoredImages} imagens`,
                  "Temas e editor completo",
                  "URL makebio.com.br/seu-slug",
                ]}
              />
              <PricingCard
                name="Pro"
                tagline="Para quem escala a presença"
                href={signedIn ? "/billing" : "/sign-up"}
                cta={signedIn ? "Ver upgrade" : "Começar e fazer upgrade"}
                highlighted
                features={[
                  `Até ${PLAN_LIMITS.PRO.maxPages} páginas`,
                  `Até ${PLAN_LIMITS.PRO.maxLinksPerPage} links por página`,
                  `Até ${PLAN_LIMITS.PRO.maxStoredImages} imagens`,
                  "Tudo do Free incluso",
                  "Ideal para marcas e projetos paralelos",
                ]}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="lp-section lp-section-alt">
          <div className="lp-shell lp-faq-wrap">
            <header className="lp-section-head">
              <h2>Perguntas frequentes</h2>
              <p>Respostas diretas antes de você criar a conta.</p>
            </header>
            <div className="lp-faq">
              {FAQS.map((item) => (
                <details key={item.q} className="lp-faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="lp-final">
          <div className="lp-shell lp-final-inner">
            <h2>Um link. Toda a sua presença.</h2>
            <p>
              Crie sua página MakeBio e comece a direcionar seguidores para o
              que importa.
            </p>
            <Button asChild size="lg" className="lp-btn-primary">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-shell lp-footer-inner">
          <div className="lp-footer-brand">
            <LogoTheme force="light" />
            <span>MakeBio</span>
          </div>
          <p>© {new Date().getFullYear()} MakeBio · Link na bio em português</p>
          <div className="lp-footer-links">
            <Link href="/sign-in">Entrar</Link>
            <Link href="/sign-up">Criar conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({
  name,
  tagline,
  features,
  href,
  cta,
  highlighted = false,
}: {
  name: string;
  tagline: string;
  features: string[];
  href: string;
  cta: string;
  highlighted?: boolean;
}) {
  return (
    <article className={`lp-price ${highlighted ? "lp-price-pro" : ""}`}>
      <h3>{name}</h3>
      <p className="lp-price-tag">{tagline}</p>
      <ul>
        {features.map((f) => (
          <li key={f}>
            <Check className="h-4 w-4 shrink-0" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={highlighted ? "lp-btn-primary" : "lp-btn-outline"}
        variant={highlighted ? "default" : "outline"}
      >
        <Link href={href}>{cta}</Link>
      </Button>
    </article>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24Zm6.29-8.14a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 2.4c-2.6 0-2.93.01-3.96.06a6.56 6.56 0 0 0-2.17.41 4.36 4.36 0 0 0-1.58 1.03 4.36 4.36 0 0 0-1.03 1.58 6.56 6.56 0 0 0-.41 2.17C2.41 9.07 2.4 9.4 2.4 12s.01 2.93.06 3.96c.03.79.16 1.57.41 2.17a4.36 4.36 0 0 0 1.03 1.58 4.36 4.36 0 0 0 1.58 1.03c.6.25 1.38.38 2.17.41 1.03.05 1.36.06 3.96.06s2.93-.01 3.96-.06c.79-.03 1.57-.16 2.17-.41a4.36 4.36 0 0 0 1.58-1.03 4.36 4.36 0 0 0 1.03-1.58c.25-.6.38-1.38.41-2.17.05-1.03.06-1.36.06-3.96s-.01-2.93-.06-3.96a6.56 6.56 0 0 0-.41-2.17 4.36 4.36 0 0 0-1.03-1.58 4.36 4.36 0 0 0-1.58-1.03 6.56 6.56 0 0 0-2.17-.41C14.93 2.41 14.6 2.4 12 2.4Zm0 1.68c2.56 0 2.86.01 3.87.06.69.03 1.07.15 1.32.25.33.13.57.28.82.53.25.25.4.49.53.82.1.25.22.63.25 1.32.05 1 .06 1.3.06 3.87s-.01 2.86-.06 3.87c-.03.69-.15 1.07-.25 1.32a2.2 2.2 0 0 1-.53.82 2.2 2.2 0 0 1-.82.53c-.25.1-.63.22-1.32.25-1 .05-1.3.06-3.87.06s-2.86-.01-3.87-.06c-.69-.03-1.07-.15-1.32-.25a2.2 2.2 0 0 1-.82-.53 2.2 2.2 0 0 1-.53-.82c-.1-.25-.22-.63-.25-1.32-.05-1-.06-1.3-.06-3.87s.01-2.86.06-3.87c.03-.69.15-1.07.25-1.32.13-.33.28-.57.53-.82.25-.25.49-.4.82-.53.25-.1.63-.22 1.32-.25 1.01-.05 1.31-.06 3.87-.06Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.65 12 3.65 12 3.65s-7.5 0-9.38.43A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.43 9.38.43 9.38.43s7.5 0 9.38-.43a3 3 0 0 0 2.12-2.12A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.75 15.57V8.43L15.82 12l-6.07 3.57Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-1-.11Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.27-.02-.42.12-.56.13-.13.28-.32.42-.48.14-.16.18-.27.28-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.57.65.2 1.25.18 1.72.11.52-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32Z" />
      <path d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89c0 1.75.46 3.45 1.33 4.95L2.1 22l5.3-1.39a9.86 9.86 0 0 0 4.64 1.18h.01c5.46 0 9.89-4.43 9.89-9.89C21.94 6.44 17.5 2 12.04 2Zm0 18.07h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.15.82.84-3.07-.2-.32a8.2 8.2 0 0 1-1.26-4.38c0-4.53 3.69-8.21 8.22-8.21 4.53 0 8.21 3.68 8.21 8.21 0 4.53-3.68 8.21-8.18 8.27Z" />
    </svg>
  );
}
