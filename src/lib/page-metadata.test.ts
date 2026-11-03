import { describe, expect, it } from "vitest";
import {
  buildPublicPageDescription,
  buildPublicPageMetadata,
} from "./page-metadata";

const published = {
  slug: "teste",
  title: "Testinho",
  bio: "Blabluble",
  image: "https://cdn.exemplo.com/capa.webp",
  published: true,
};

describe("buildPublicPageDescription", () => {
  it("includes name, handle and bio", () => {
    expect(buildPublicPageDescription(published)).toBe(
      "Testinho (@teste) — Blabluble"
    );
  });

  it("falls back without bio", () => {
    expect(
      buildPublicPageDescription({ ...published, bio: "  " })
    ).toBe("Testinho (@teste) no MakeBio");
  });
});

describe("buildPublicPageMetadata", () => {
  it("uses the page title, bio and cover instead of the site logo", () => {
    const meta = buildPublicPageMetadata(published);

    expect(meta.title).toEqual({ absolute: "Testinho" });
    expect(meta.description).toBe("Testinho (@teste) — Blabluble");
    expect(meta.openGraph?.title).toBe("Testinho");
    expect(meta.openGraph?.description).toBe(
      "Testinho (@teste) — Blabluble"
    );
    expect(meta.openGraph?.url).toBe("https://www.makebio.com.br/teste");
    expect(meta.openGraph?.images).toEqual([
      { url: "https://cdn.exemplo.com/capa.webp", alt: "Testinho" },
    ]);
    expect(meta.twitter?.images).toEqual([
      "https://cdn.exemplo.com/capa.webp",
    ]);
    const serialized = JSON.stringify(meta);
    expect(serialized).toContain("summary_large_image");
    expect(serialized).not.toContain("og-image.png");
    expect(serialized).not.toContain("Crie sua página de links");
  });

  it("omits images when the page has no photo", () => {
    const meta = buildPublicPageMetadata({
      ...published,
      bio: null,
      image: null,
    });

    expect(meta.description).toBe("Testinho (@teste) no MakeBio");
    expect(meta.openGraph?.images).toEqual([]);
    expect(JSON.stringify(meta.twitter)).toContain('"card":"summary"');
  });

  it("hides unpublished pages from crawlers", () => {
    const meta = buildPublicPageMetadata({
      ...published,
      published: false,
    });

    expect(meta.title).toBe("Página não encontrada");
    expect(meta.openGraph).toBeUndefined();
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
