import { describe, it, expect } from "vitest";
import { updateProfileSchema, changePasswordSchema } from "@/schemas/profile";

describe("updateProfileSchema", () => {
  it("accepts a valid name", () => {
    expect(updateProfileSchema.safeParse({ name: "Maria" }).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = updateProfileSchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/2 caracteres/);
  });

  it("rejects name longer than 80 chars", () => {
    const result = updateProfileSchema.safeParse({ name: "A".repeat(81) });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    expect(updateProfileSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("allows exactly 80 chars", () => {
    expect(updateProfileSchema.safeParse({ name: "A".repeat(80) }).success).toBe(true);
  });
});

describe("changePasswordSchema", () => {
  const valid = {
    currentPassword: "senhaAtual1",
    newPassword: "novaSenha1",
    confirmPassword: "novaSenha1",
  };

  it("accepts valid input", () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty currentPassword", () => {
    const result = changePasswordSchema.safeParse({ ...valid, currentPassword: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/Informe a senha atual/);
  });

  it("rejects newPassword shorter than 8 chars", () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      newPassword: "abc",
      confirmPassword: "abc",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/8 caracteres/);
  });

  it("rejects newPassword longer than 72 chars", () => {
    const long = "a".repeat(73);
    const result = changePasswordSchema.safeParse({
      ...valid,
      newPassword: long,
      confirmPassword: long,
    });
    expect(result.success).toBe(false);
  });

  it("rejects when passwords do not match", () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      confirmPassword: "diferente",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/não conferem/);
  });

  it("allows max-length password (72)", () => {
    const p = "a".repeat(72);
    expect(
      changePasswordSchema.safeParse({ ...valid, newPassword: p, confirmPassword: p }).success
    ).toBe(true);
  });
});
