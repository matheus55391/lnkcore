import { describe, it, expect } from "vitest";
import { createPageSchema, updatePageSchema, deletePageSchema } from "@/schemas/pages";

describe("createPageSchema — slug validation", () => {
  it("accepts a valid slug", () => {
    expect(createPageSchema.safeParse({ slug: "meu-perfil" }).success).toBe(true);
  });

  it("accepts slug with numbers", () => {
    expect(createPageSchema.safeParse({ slug: "perfil123" }).success).toBe(true);
  });

  it("accepts slug at minimum length (3)", () => {
    expect(createPageSchema.safeParse({ slug: "abc" }).success).toBe(true);
  });

  it("accepts slug at maximum length (30)", () => {
    expect(createPageSchema.safeParse({ slug: "a".repeat(30) }).success).toBe(true);
  });

  it("rejects slug shorter than 3 chars", () => {
    const result = createPageSchema.safeParse({ slug: "ab" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/3 caracteres/);
  });

  it("rejects slug longer than 30 chars", () => {
    const result = createPageSchema.safeParse({ slug: "a".repeat(31) });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/30 caracteres/);
  });

  it("rejects slug with uppercase letters", () => {
    const result = createPageSchema.safeParse({ slug: "MeuPerfil" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/minúsculas/);
  });

  it("rejects slug starting with a hyphen", () => {
    expect(createPageSchema.safeParse({ slug: "-perfil" }).success).toBe(false);
  });

  it("rejects slug ending with a hyphen", () => {
    expect(createPageSchema.safeParse({ slug: "perfil-" }).success).toBe(false);
  });

  it("rejects slug with consecutive hyphens", () => {
    expect(createPageSchema.safeParse({ slug: "meu--perfil" }).success).toBe(false);
  });

  it("rejects slug with spaces", () => {
    expect(createPageSchema.safeParse({ slug: "meu perfil" }).success).toBe(false);
  });

  it("rejects slug with special characters", () => {
    expect(createPageSchema.safeParse({ slug: "meu_perfil" }).success).toBe(false);
    expect(createPageSchema.safeParse({ slug: "perfil@user" }).success).toBe(false);
  });
});

describe("updatePageSchema", () => {
  const valid = {
    id: "page-1",
    title: "Minha Página",
  };

  it("accepts valid input", () => {
    expect(updatePageSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional bio", () => {
    expect(updatePageSchema.safeParse({ ...valid, bio: "Minha bio" }).success).toBe(true);
  });

  it("accepts null bio", () => {
    expect(updatePageSchema.safeParse({ ...valid, bio: null }).success).toBe(true);
  });

  it("rejects bio longer than 280 chars", () => {
    expect(
      updatePageSchema.safeParse({ ...valid, bio: "A".repeat(281) }).success
    ).toBe(false);
  });

  it("accepts valid image URL", () => {
    expect(
      updatePageSchema.safeParse({ ...valid, image: "https://cdn.exemplo.com/img.jpg" }).success
    ).toBe(true);
  });

  it("rejects invalid image URL", () => {
    const result = updatePageSchema.safeParse({ ...valid, image: "not-a-url" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/URL inválida/);
  });

  it("accepts null image", () => {
    expect(updatePageSchema.safeParse({ ...valid, image: null }).success).toBe(true);
  });

  it("accepts optional published flag", () => {
    expect(updatePageSchema.safeParse({ ...valid, published: false }).success).toBe(true);
  });

  it("accepts optional themeId as positive int", () => {
    expect(updatePageSchema.safeParse({ ...valid, themeId: 2 }).success).toBe(true);
  });

  it("rejects themeId of 0", () => {
    expect(updatePageSchema.safeParse({ ...valid, themeId: 0 }).success).toBe(false);
  });

  it("rejects empty title", () => {
    const result = updatePageSchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/Título obrigatório/);
  });

  it("rejects title longer than 80 chars", () => {
    expect(
      updatePageSchema.safeParse({ ...valid, title: "A".repeat(81) }).success
    ).toBe(false);
  });

  it("rejects empty id", () => {
    expect(updatePageSchema.safeParse({ ...valid, id: "" }).success).toBe(false);
  });
});

describe("deletePageSchema", () => {
  it("accepts valid id", () => {
    expect(deletePageSchema.safeParse({ id: "page-abc" }).success).toBe(true);
  });

  it("rejects empty id", () => {
    expect(deletePageSchema.safeParse({ id: "" }).success).toBe(false);
  });

  it("rejects missing id", () => {
    expect(deletePageSchema.safeParse({}).success).toBe(false);
  });
});
