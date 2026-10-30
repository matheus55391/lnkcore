"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { THEMES, type Theme } from "@/lib/themes";

type DemoLink =
  | { style: "featured"; title: string }
  | { style: "classic"; title: string };

type DemoProfile = {
  name: string;
  handle: string;
  bio: string;
  links: DemoLink[];
  socials: string[];
  theme: Theme;
  avatar: string;
};

function themeByName(name: string): Theme {
  return THEMES.find((t) => t.name === name) ?? THEMES[0];
}

const PROFILES: DemoProfile[] = [
  {
    name: "ana.cria",
    handle: "anacria",
    bio: "cursos, portfólio e o que estou lançando",
    links: [
      { style: "featured", title: "Curso novo" },
      { style: "classic", title: "Portfólio" },
      { style: "classic", title: "WhatsApp" },
    ],
    socials: ["#e1306c", "#000000", "#ff0000"],
    theme: themeByName("Astrid"),
    avatar: "/lp-avatar.jpg",
  },
  {
    name: "studio.mx",
    handle: "studiomx",
    bio: "design, branding e cases recentes",
    links: [
      { style: "featured", title: "Cases 2026" },
      { style: "classic", title: "Behance" },
      { style: "classic", title: "Orçamento" },
    ],
    socials: ["#0a66c2", "#181717", "#e60023"],
    theme: themeByName("Lake"),
    avatar: "/lp-avatar-2.jpg",
  },
  {
    name: "lua.fit",
    handle: "luafit",
    bio: "treino, rotina e o que uso no dia a dia",
    links: [
      { style: "featured", title: "Plano da semana" },
      { style: "classic", title: "YouTube" },
      { style: "classic", title: "App" },
    ],
    socials: ["#ff0000", "#000000", "#25d366"],
    theme: themeByName("Neon"),
    avatar: "/lp-avatar-3.jpg",
  },
  {
    name: "cafe.norte",
    handle: "cafenorte",
    bio: "cardápio, delivery e eventos da semana",
    links: [
      { style: "featured", title: "Cardápio de outubro" },
      { style: "classic", title: "Delivery" },
      { style: "classic", title: "Reservas" },
    ],
    socials: ["#e1306c", "#25d366", "#1877f2"],
    theme: themeByName("Encore"),
    avatar: "/lp-avatar-4.jpg",
  },
  {
    name: "dj.pulse",
    handle: "djpulse",
    bio: "sets, agenda e links das noites",
    links: [
      { style: "featured", title: "Próxima festa" },
      { style: "classic", title: "Spotify" },
      { style: "classic", title: "Booking" },
    ],
    socials: ["#1db954", "#9146ff", "#000000"],
    theme: themeByName("Bloom"),
    avatar: "/lp-avatar-5.jpg",
  },
];

const INTERVAL_MS = 3800;

/**
 * Decorative iPhone mock with auto-rotating demo profiles
 * using the cover layout from the product.
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
  const statusStyle = { "--lp-status": "#ffffff" } as CSSProperties;

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
            className={`lp-phone-content lp-phone-content-cover ${visible ? "lp-slide-in" : "lp-slide-out"}`}
          >
            <div className="lp-mock-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.avatar} alt="" />
              <span
                className="lp-mock-hero-fade"
                style={{
                  background: `linear-gradient(to top, ${theme.background} 0%, transparent 62%)`,
                }}
              />
              <div className="lp-mock-hero-meta">
                <p className="lp-mock-name">{profile.name}</p>
                <p className="lp-mock-handle">@{profile.handle}</p>
                <div className="lp-mock-socials">
                  {profile.socials.map((color, socialIndex) => (
                    <span
                      key={`${profile.handle}-${socialIndex}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lp-mock-body">
              <p className="lp-mock-bio">{profile.bio}</p>
              <div className="lp-mock-links">
                {profile.links.map((link) =>
                  link.style === "featured" ? (
                    <span
                      key={link.title}
                      className="lp-mock-featured"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={profile.avatar} alt="" />
                      <span className="lp-mock-featured-label">
                        {link.title}
                      </span>
                    </span>
                  ) : (
                    <span
                      key={link.title}
                      className="lp-mock-classic"
                      style={{
                        background: theme.cardBg,
                        borderColor: theme.cardBorder,
                        color: theme.foreground,
                      }}
                    >
                      {link.title}
                    </span>
                  )
                )}
              </div>
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
