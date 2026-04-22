import { describe, expect, it } from "vitest";
import { createLinkSchema } from "./link";

describe("createLinkSchema", () => {
  it("validates a correct link payload", () => {
    const parsed = createLinkSchema.parse({
      title: "GitHub",
      url: "https://github.com/matheus",
      description: "",
      imageUrl: "",
    });

    expect(parsed.title).toBe("GitHub");
  });

  it("rejects invalid urls", () => {
    const result = createLinkSchema.safeParse({
      title: "Bad",
      url: "abc",
    });

    expect(result.success).toBe(false);
  });
});
