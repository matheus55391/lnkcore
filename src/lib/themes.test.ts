import { describe, it, expect } from "vitest";
import { THEMES, DEFAULT_THEME, getTheme } from "@/lib/themes";

describe("THEMES", () => {
  it("has 6 themes", () => {
    expect(THEMES).toHaveLength(6);
  });

  it("each theme has required fields", () => {
    for (const theme of THEMES) {
      expect(theme).toHaveProperty("id");
      expect(theme).toHaveProperty("name");
      expect(theme).toHaveProperty("background");
      expect(theme).toHaveProperty("foreground");
      expect(theme).toHaveProperty("accent");
      expect(theme).toHaveProperty("cardBg");
      expect(theme).toHaveProperty("cardBorder");
    }
  });

  it("each theme has a unique id", () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(THEMES.length);
  });

  it("ids are sequential starting at 1", () => {
    expect(THEMES.map((t) => t.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("DEFAULT_THEME", () => {
  it("is the first theme (id=1)", () => {
    expect(DEFAULT_THEME.id).toBe(1);
    expect(DEFAULT_THEME).toBe(THEMES[0]);
  });
});

describe("getTheme", () => {
  it("returns theme by valid id", () => {
    for (const theme of THEMES) {
      expect(getTheme(theme.id)).toBe(theme);
    }
  });

  it("returns default theme for an unknown id", () => {
    expect(getTheme(999)).toBe(DEFAULT_THEME);
  });

  it("returns default theme for null", () => {
    expect(getTheme(null)).toBe(DEFAULT_THEME);
  });

  it("returns default theme for undefined", () => {
    expect(getTheme(undefined)).toBe(DEFAULT_THEME);
  });

  it("returns theme id=1 as 'Padrão'", () => {
    expect(getTheme(1).name).toBe("Padrão");
  });

  it("returns theme id=2 as 'Meia-noite'", () => {
    expect(getTheme(2).name).toBe("Meia-noite");
  });
});
