import { describe, it, expect } from "vitest";
import { buildDiscordEmbed, publicPageUrl } from "@/lib/discord-log";

describe("buildDiscordEmbed", () => {
  it("builds a titled embed with color, footer and timestamp", () => {
    const embed = buildDiscordEmbed({
      title: "Nova página criada",
      description: "Alguém publicou um perfil.",
      kind: "success",
      url: "https://www.makebio.com.br/ana",
      fields: [
        { name: "Página", value: "[abrir](https://www.makebio.com.br/ana)" },
        { name: "Email", value: "ana@exemplo.com", inline: true },
      ],
    });

    expect(embed.title).toBe("Nova página criada");
    expect(embed.url).toBe("https://www.makebio.com.br/ana");
    expect(embed.color).toBe(0x57f287);
    expect(embed.fields).toEqual([
      {
        name: "Página",
        value: "[abrir](https://www.makebio.com.br/ana)",
        inline: false,
      },
      { name: "Email", value: "ana@exemplo.com", inline: true },
    ]);
    expect(embed.footer.text).toBe("MakeBio");
    expect(embed.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("clips overlong field values", () => {
    const embed = buildDiscordEmbed({
      title: "x",
      fields: [{ name: "Detalhes", value: "a".repeat(1100) }],
    });
    expect(embed.fields?.[0].value.length).toBe(1024);
    expect(embed.fields?.[0].value.endsWith("…")).toBe(true);
  });
});

describe("publicPageUrl", () => {
  it("joins origin and slug", () => {
    expect(publicPageUrl("ana-cria")).toMatch(/\/ana-cria$/);
  });
});
