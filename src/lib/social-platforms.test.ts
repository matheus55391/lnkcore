import { describe, it, expect } from "vitest";
import {
  detectSocialPlatform,
  platformLabelFromUrl,
} from "@/lib/social-platforms";

describe("detectSocialPlatform", () => {
  it("detects Instagram", () => {
    expect(detectSocialPlatform("https://www.instagram.com/foo").id).toBe(
      "instagram"
    );
  });

  it("detects X/Twitter", () => {
    expect(detectSocialPlatform("https://x.com/foo").id).toBe("x");
    expect(detectSocialPlatform("https://twitter.com/foo").id).toBe("x");
  });

  it("detects YouTube short links", () => {
    expect(detectSocialPlatform("https://youtu.be/abc").id).toBe("youtube");
  });

  it("falls back to link for unknown hosts", () => {
    expect(detectSocialPlatform("https://example.com").id).toBe("link");
  });

  it("returns label helper", () => {
    expect(platformLabelFromUrl("https://tiktok.com/@x")).toBe("TikTok");
  });

  it("builds profile URLs from handles", async () => {
    const { getSelectableSocial } = await import("@/lib/social-platforms");
    expect(getSelectableSocial("instagram")?.buildUrl("matheus")).toBe(
      "https://instagram.com/matheus"
    );
    expect(
      getSelectableSocial("instagram")?.buildUrl(
        "https://www.instagram.com/matheus/"
      )
    ).toBe("https://www.instagram.com/matheus/");
  });
});
