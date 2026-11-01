import { describe, expect, it } from "vitest";
import { buildPublicPageMetadata } from "./page-metadata";

const published = {
  slug: "teste",
  title: "Testinho",
  bio: "Blabluble",
  image: "https://cdn.exemplo.com/capa.webp",
  published: true,
};

describe("buildPublicPageMetadata", () => {
  it("uses the page title, bio and cover instead of the site logo", () => {
    const meta = buildPublicPageMetadata(published);

    expect(meta.title).toEqual({ absolute: "Testinho" });
    expect(meta.description).toBe("Blabluble");
    expect(meta.openGraph?.title).toBe("Testinho");
    expect(meta.openGraph?.description).toBe("Blabluble");
    expect(meta.openGraph?.url).toBe("https://www.makebio.com.br/teste");
    expect(meta.openGraph?.images).toEqual([
      { url: "https://cdn.exemplo.com/capa.webp", alt: "Testinho" },
    ]);
    expect(meta.twitter?.images).toEqual(["https://cdn.exemplo.com/capa.webp"]);
    expect(JSON.stringify(meta)).not.toContain("og-image.png");
    expect(JSON.stringify(meta)).not.toContain("Crie sua página de links");
  });

  it("falls back to a page-specific description when bio is empty", () => {
    const meta = buildPublicPageMetadata({
      ...published,
      bio: "   ",
      image: null,
    });

    expect(meta.description).toBe("Testinho (@teste) no MakeBio");
    expect(meta.openGraph?.images).toEqual([]);
    expect(meta.twitter?.card).toBe("summary");
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
