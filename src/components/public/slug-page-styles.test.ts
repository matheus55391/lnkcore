import { describe, expect, it } from "vitest";
import { PageLayout } from "@/@types";
import { THEMES } from "@/lib/themes";
import { getSlugPageStyles, slugLayoutAttr } from "./slug-page-styles";

describe("slugLayoutAttr", () => {
  it("emits lowercase hooks that match the cover CSS selectors", () => {
    expect(slugLayoutAttr(PageLayout.COVER)).toBe("cover");
    expect(slugLayoutAttr(PageLayout.CLASSIC)).toBe("classic");
    expect(slugLayoutAttr(undefined)).toBe("classic");

    const css = getSlugPageStyles("sp-test", THEMES[0]);
    expect(css).toContain('[data-layout="cover"]');
    expect(css).not.toContain('[data-layout="COVER"]');
    expect(css).toContain("var(--sp-bg) 0%");
    expect(css).toContain("var(--sp-bg) 24%");
    expect(css).toContain("border-radius: 2.15rem");
    expect(css).toContain(".sp-device");
    expect(css).toContain(".sp-link-featured-photo");
    expect(css).toContain("aspect-ratio: 4 / 3");
    expect(css).toContain(".sp-link-featured-tall");
    expect(css).toContain("aspect-ratio: 4 / 5");
  });
});
