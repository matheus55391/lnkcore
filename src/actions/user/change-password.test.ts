import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      changePassword: vi.fn(),
    },
  },
}));

import { requireSession } from "@/utils/session";
import { auth } from "@/lib/auth";
import { changePassword } from "@/actions/user/change-password";

const BASE_DATE = new Date("2025-01-01");

const mockSession: Session = {
  user: {
    id: "user-1",
    name: "Test User",
    email: "test@test.com",
    emailVerified: true,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
    image: null,
  },
  session: {
    id: "sess-1",
    token: "token-1",
    userId: "user-1",
    expiresAt: new Date("2026-01-01"),
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
    ipAddress: null,
    userAgent: null,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
});

describe("changePassword", () => {
  it("returns success when password is changed successfully", async () => {
    const result = await changePassword("senhaAtual", "novaSenha");
    expect(result.success).toBe(true);
  });

  it("calls auth.api.changePassword with correct arguments", async () => {
    await changePassword("atual", "nova");
    expect(auth.api.changePassword).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          currentPassword: "atual",
          newPassword: "nova",
          revokeOtherSessions: false,
        },
      })
    );
  });

  it("returns 'Senha atual incorreta' when auth throws 'Invalid password'", async () => {
    vi.mocked(auth.api.changePassword).mockRejectedValue(
      new Error("Invalid password")
    );

    const result = await changePassword("errada", "nova");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Senha atual incorreta/);
  });

  it("returns generic error for other exceptions", async () => {
    vi.mocked(auth.api.changePassword).mockRejectedValue(
      new Error("Unexpected server error")
    );

    const result = await changePassword("atual", "nova");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/alterar a senha/);
  });

  it("handles non-Error throws gracefully", async () => {
    vi.mocked(auth.api.changePassword).mockRejectedValue("string error");

    const result = await changePassword("atual", "nova");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/alterar a senha/);
  });
});
