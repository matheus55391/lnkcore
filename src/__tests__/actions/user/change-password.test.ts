import { describe, it, expect, vi, beforeEach } from "vitest";

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

const mockSession = {
  user: { id: "user-1" },
  session: { id: "sess-1" },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
});

describe("changePassword", () => {
  it("returns success when password is changed successfully", async () => {
    vi.mocked(auth.api.changePassword).mockResolvedValue({} as any);

    const result = await changePassword("senhaAtual", "novaSenha");
    expect(result.success).toBe(true);
  });

  it("calls auth.api.changePassword with correct arguments", async () => {
    vi.mocked(auth.api.changePassword).mockResolvedValue({} as any);

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
