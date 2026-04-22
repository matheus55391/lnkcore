import { describe, expect, it } from "vitest";
import { updatePageSchema } from "./page";

describe("updatePageSchema", () => {
  it("validates a valid payload", () => {
    const parsed = updatePageSchema.parse({
      slug: "meu-slug",
      title: "Minha page",
      description: "Bio",
      avatarUrl: "https://cdn.lnkcore.com/avatar.png",
    });

    expect(parsed.slug).toBe("meu-slug");
  });

  it("rejects invalid slug", () => {
    const result = updatePageSchema.safeParse({
      slug: "Slug Invalido",
      title: "Minha page",
    });

    expect(result.success).toBe(false);
  });
});
