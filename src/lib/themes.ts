/**
 * Sistema de temas para a página pública de links.
 *
 * Para adicionar um novo tema:
 *  1. Acrescente um objeto no array THEMES com o próximo id sequencial
 *  — não precisa de migration, temas são puramente código
 */

export interface Theme {
  id: number;
  name: string;
  background: string; // fundo da página
  foreground: string; // texto principal
  accent: string;     // destaque: hover, ícones
  cardBg: string;     // fundo do card de link
  cardBorder: string; // borda do card de link
}

export const THEMES: Theme[] = [
  {
    id: 1,
    name: "Padrão",
    background: "#ffffff",
    foreground: "#0a0a0a",
    accent: "#3b82f6",
    cardBg: "#f9fafb",
    cardBorder: "#e5e7eb",
  },
  {
    id: 2,
    name: "Meia-noite",
    background: "#0f0f1a",
    foreground: "#e2e8f0",
    accent: "#818cf8",
    cardBg: "#1e1e3a",
    cardBorder: "#2d2d5e",
  },
  {
    id: 3,
    name: "Oceano",
    background: "#0c1a2e",
    foreground: "#e0f2fe",
    accent: "#38bdf8",
    cardBg: "#0f2744",
    cardBorder: "#1e3a5f",
  },
  {
    id: 4,
    name: "Floresta",
    background: "#0d1f0f",
    foreground: "#d1fae5",
    accent: "#34d399",
    cardBg: "#14291a",
    cardBorder: "#1f4a2a",
  },
  {
    id: 5,
    name: "Pôr do sol",
    background: "#fef3e2",
    foreground: "#431407",
    accent: "#f97316",
    cardBg: "#fff7ed",
    cardBorder: "#fed7aa",
  },
  {
    id: 6,
    name: "Rosa",
    background: "#fff0f3",
    foreground: "#3b0a1a",
    accent: "#f43f5e",
    cardBg: "#fff5f7",
    cardBorder: "#fecdd3",
  },
];

export const DEFAULT_THEME = THEMES[0];

export function getTheme(id: number | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;
}
