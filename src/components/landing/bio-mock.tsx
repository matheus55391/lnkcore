"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { THEMES, type Theme } from "@/lib/themes";

type DemoProfile = {
  name: string;
  bio: string;
  links: string[];
  theme: Theme;
  avatar: string;
};

function themeByName(name: string): Theme {
  return THEMES.find((t) => t.name === name) ?? THEMES[0];
}

const PROFILES: DemoProfile[] = [
  {
    name: "ana.cria",
    bio: "conteúdo, cursos e o que estou lançando",
    links: ["Portfólio", "Curso novo", "Loja", "Contato"],
    theme: themeByName("Mineral"),
    avatar: "/lp-avatar.jpg",
  },
  {
    name: "studio.mx",
    bio: "design, branding e cases recentes",
    links: ["Behance", "Cases", "Orçamento", "Sobre"],
    theme: themeByName("Astrid"),
    avatar: "/lp-avatar-2.jpg",
  },
  {
    name: "lua.fit",
    bio: "treino, rotina e o que uso no dia a dia",
    links: ["Plano", "YouTube", "App", "Parceiros"],
    theme: themeByName("Neon"),
    avatar: "/lp-avatar-3.jpg",
  },
  {
    name: "cafe.norte",
    bio: "cardápio, delivery e eventos da semana",
    links: ["Cardápio", "Delivery", "Reservas", "Menu"],
    theme: themeByName("Aura"),
    avatar: "/lp-avatar-4.jpg",
  },
  {
    name: "dj.pulse",
    bio: "sets, agenda e links das noites",
    links: ["Agenda", "Spotify", "Ingressos", "Booking"],
    theme: themeByName("Bloom"),
    avatar: "/lp-avatar-5.jpg",
  },
];

const INTERVAL_MS = 3200;

/**
 * Decorative iPhone mock with auto-rotating demo profiles
 * using real page themes from the product.
 */
export function BioMock({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let fadeTimer = 0;
    const id = window.setInterval(() => {
      setVisible(false);
      fadeTimer = window.setTimeout(() => {
        setIndex((i) => (i + 1) % PROFILES.length);
        setVisible(true);
      }, 280);
    }, INTERVAL_MS);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(fadeTimer);
    };
  }, []);

  const profile = PROFILES[index];
  const { theme } = profile;
  const statusStyle = { "--lp-status": theme.foreground } as CSSProperties;

  return (
    <div className={`lp-phone ${className}`} aria-hidden="true">
      <div className="lp-phone-btn lp-phone-btn-silent" />
      <div className="lp-phone-btn lp-phone-btn-vol-up" />
      <div className="lp-phone-btn lp-phone-btn-vol-down" />
      <div className="lp-phone-btn lp-phone-btn-power" />

      <div className="lp-phone-bezel">
        <div
          className="lp-phone-screen"
          style={{
            backgroundColor: theme.background,
            color: theme.foreground,
            transition: "background-color 0.45s ease, color 0.45s ease",
          }}
        >
          <div className="lp-phone-island">
            <span className="lp-phone-lens" />
          </div>

          <div className="lp-phone-status" style={statusStyle}>
            <span>9:41</span>
            <span className="lp-phone-status-icons">
              <span className="lp-signal" />
              <span className="lp-wifi" />
              <span className="lp-battery" />
            </span>
          </div>

          <div
            className={`lp-phone-content ${visible ? "lp-slide-in" : "lp-slide-out"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt=""
              className="lp-mock-avatar"
              width={88}
              height={88}
            />
            <p className="lp-mock-name">{profile.name}</p>
            <p className="lp-mock-bio">{profile.bio}</p>
            <div className="lp-mock-links">
              {profile.links.map((link) => (
                <span
                  key={link}
                  style={{
                    background: theme.cardBg,
                    borderColor: theme.cardBorder,
                    color: theme.foreground,
                  }}
                >
                  {link}
                </span>
              ))}
            </div>
          </div>

          <div className="lp-phone-home" style={{ background: theme.foreground }} />

          <div className="lp-phone-dots">
            {PROFILES.map((p, i) => (
              <span
                key={p.name}
                className={i === index ? "is-active" : undefined}
                style={{ background: theme.foreground }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
