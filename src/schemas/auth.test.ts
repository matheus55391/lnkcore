import { describe, it, expect } from "vitest";
import { signUpSchema, signInSchema } from "@/schemas/auth";

describe("signUpSchema", () => {
  const valid = {
    name: "João Silva",
    email: "joao@exemplo.com",
    password: "senha123",
    confirmPassword: "senha123",
  };

  it("accepts valid input", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = signUpSchema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/2 caracteres/);
  });

  it("rejects name longer than 80 chars", () => {
    const result = signUpSchema.safeParse({ ...valid, name: "A".repeat(81) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/Email inválido/);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = signUpSchema.safeParse({
      ...valid,
      password: "abc",
      confirmPassword: "abc",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/8 caracteres/);
  });

  it("rejects password longer than 72 chars", () => {
    const long = "a".repeat(73);
    const result = signUpSchema.safeParse({
      ...valid,
      password: long,
      confirmPassword: long,
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({
      ...valid,
      confirmPassword: "diferente",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/não conferem/);
  });

  it("allows exact minimum values", () => {
    expect(
      signUpSchema.safeParse({ ...valid, name: "Jo", password: "12345678", confirmPassword: "12345678" }).success
    ).toBe(true);
  });

  it("allows exact maximum password length (72)", () => {
    const p = "a".repeat(72);
    expect(
      signUpSchema.safeParse({ ...valid, password: p, confirmPassword: p }).success
    ).toBe(true);
  });
});

describe("signInSchema", () => {
  const valid = { email: "joao@exemplo.com", password: "qualquercoisa" };

  it("accepts valid input", () => {
    expect(signInSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = signInSchema.safeParse({ ...valid, email: "bad" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = signInSchema.safeParse({ ...valid, password: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/Informe sua senha/);
  });

  it("rejects missing fields", () => {
    expect(signInSchema.safeParse({}).success).toBe(false);
    expect(signInSchema.safeParse({ email: valid.email }).success).toBe(false);
  });
});
