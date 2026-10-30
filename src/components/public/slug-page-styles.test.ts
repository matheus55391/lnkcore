import { describe, expect, it } from "vitest";
import { THEMES } from "@/lib/themes";
import { getSlugPageStyles, slugLayoutAttr } from "./slug-page-styles";

describe("slugLayoutAttr", () => {
  it("emits lowercase hooks that match the cover CSS selectors", () => {
    expect(slugLayoutAttr("COVER")).toBe("cover");
    expect(slugLayoutAttr("CLASSIC")).toBe("classic");
    expect(slugLayoutAttr(undefined)).toBe("classic");

    const css = getSlugPageStyles("sp-test", THEMES[0]);
    expect(css).toContain('[data-layout="cover"]');
    expect(css).not.toContain('[data-layout="COVER"]');
  });
});
