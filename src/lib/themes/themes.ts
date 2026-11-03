/**
 * Sistema de temas para a página pública de links.
 * Compatível com a estrutura atual.
 */

export interface Theme {
  id: number;
  name: string;
  background: string;
  foreground: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
}

export const THEMES: Theme[] = [
  {
    id: 1,
    name: "Air",
    background: "#f3f4f6",
    foreground: "#111111",
    accent: "#111111",
    cardBg: "#ffffff",
    cardBorder: "#d4d4d8",
  },

  {
    id: 2,
    name: "Astrid",
    background: "#111111",
    foreground: "#ffffff",
    accent: "#ffffff",
    cardBg: "#1c1c1f",
    cardBorder: "#2c2c31",
  },

  {
    id: 3,
    name: "Aura",
    background: "#ebe7df",
    foreground: "#2c2a28",
    accent: "#5f5a53",
    cardBg: "#f5f2ec",
    cardBorder: "#d6d1ca",
  },

  {
    id: 4,
    name: "Bloom",
    background: "#5b3df5",
    foreground: "#ffffff",
    accent: "#ff6b81",
    cardBg: "#6d52ff",
    cardBorder: "#8d78ff",
  },

  {
    id: 5,
    name: "Blocks",
    background: "#7c3aed",
    foreground: "#ffffff",
    accent: "#ff66c4",
    cardBg: "#9333ea",
    cardBorder: "#000000",
  },

  {
    id: 6,
    name: "Encore",
    background: "#050816",
    foreground: "#f8fafc",
    accent: "#f5c2a8",
    cardBg: "#0f172a",
    cardBorder: "#f5c2a8",
  },

  {
    id: 7,
    name: "Groove",
    background: "#5f27cd",
    foreground: "#ffffff",
    accent: "#ff9ff3",
    cardBg: "#6c35db",
    cardBorder: "#8c52ff",
  },

  {
    id: 8,
    name: "Haven",
    background: "#b7aa95",
    foreground: "#2c2a28",
    accent: "#3d3b38",
    cardBg: "#d8cfbf",
    cardBorder: "#9e927e",
  },

  {
    id: 9,
    name: "Lake",
    background: "#0f172a",
    foreground: "#ffffff",
    accent: "#93c5fd",
    cardBg: "#020617",
    cardBorder: "#1e293b",
  },

  {
    id: 10,
    name: "Mineral",
    background: "#ede0d4",
    foreground: "#111111",
    accent: "#8d7b68",
    cardBg: "#f5ebe0",
    cardBorder: "#c9b8a7",
  },

  {
    id: 11,
    name: "Neon",
    background: "#050816",
    foreground: "#ffffff",
    accent: "#00f5d4",
    cardBg: "#0f172a",
    cardBorder: "#00f5d4",
  },

  {
    id: 12,
    name: "Ocean",
    background: "#07111f",
    foreground: "#e0f2fe",
    accent: "#38bdf8",
    cardBg: "#0f1b2d",
    cardBorder: "#1d3557",
  },
];

export const DEFAULT_THEME = THEMES[0];

export function getTheme(id: number | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;
}