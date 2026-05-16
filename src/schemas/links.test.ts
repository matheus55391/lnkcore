import { describe, it, expect } from "vitest";
import { createLinkSchema, updateLinkSchema, deleteLinkSchema } from "@/schemas/links";

describe("createLinkSchema", () => {
  const valid = {
    pageId: "page-1",
    title: "Meu site",
    url: "https://exemplo.com",
  };

  it("accepts valid input", () => {
    expect(createLinkSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional image as URL", () => {
    expect(
      createLinkSchema.safeParse({ ...valid, image: "https://cdn.exemplo.com/img.png" }).success
    ).toBe(true);
  });

  it("accepts null image", () => {
    expect(createLinkSchema.safeParse({ ...valid, image: null }).success).toBe(true);
  });

  it("rejects empty pageId", () => {
    expect(createLinkSchema.safeParse({ ...valid, pageId: "" }).success).toBe(false);
  });

  it("rejects empty title", () => {
    const result = createLinkSchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/Título obrigatório/);
  });

  it("rejects title longer than 80 chars", () => {
    expect(
      createLinkSchema.safeParse({ ...valid, title: "A".repeat(81) }).success
    ).toBe(false);
  });

  it("rejects invalid URL", () => {
    const result = createLinkSchema.safeParse({ ...valid, url: "not-a-url" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/URL inválida/);
  });

  it("rejects image that is not a URL", () => {
    expect(
      createLinkSchema.safeParse({ ...valid, image: "not-a-url" }).success
    ).toBe(false);
  });
});

describe("updateLinkSchema", () => {
  const valid = {
    id: "link-1",
    title: "Título atualizado",
    url: "https://novo.exemplo.com",
  };

  it("accepts valid input", () => {
    expect(updateLinkSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional active flag", () => {
    expect(updateLinkSchema.safeParse({ ...valid, active: false }).success).toBe(true);
  });

  it("accepts optional position", () => {
    expect(updateLinkSchema.safeParse({ ...valid, position: 3 }).success).toBe(true);
  });

  it("rejects negative position", () => {
    expect(updateLinkSchema.safeParse({ ...valid, position: -1 }).success).toBe(false);
  });

  it("rejects float position", () => {
    expect(updateLinkSchema.safeParse({ ...valid, position: 1.5 }).success).toBe(false);
  });

  it("rejects empty id", () => {
    expect(updateLinkSchema.safeParse({ ...valid, id: "" }).success).toBe(false);
  });

  it("rejects invalid URL", () => {
    expect(updateLinkSchema.safeParse({ ...valid, url: "invalid" }).success).toBe(false);
  });
});

describe("deleteLinkSchema", () => {
  it("accepts valid id", () => {
    expect(deleteLinkSchema.safeParse({ id: "link-abc" }).success).toBe(true);
  });

  it("rejects empty id", () => {
    expect(deleteLinkSchema.safeParse({ id: "" }).success).toBe(false);
  });

  it("rejects missing id", () => {
    expect(deleteLinkSchema.safeParse({}).success).toBe(false);
  });
});
