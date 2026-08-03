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
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/denunciar">Denunciar</Link>
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

