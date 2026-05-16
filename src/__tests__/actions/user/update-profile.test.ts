import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      updateUser: vi.fn(),
    },
  },
}));

import { requireSession } from "@/utils/session";
import { auth } from "@/lib/auth";
import { updateProfile } from "@/actions/user/update-profile";

const mockSession = {
  user: { id: "user-1" },
  session: { id: "sess-1" },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
});

describe("updateProfile", () => {
  it("returns success when auth.api.updateUser succeeds", async () => {
    vi.mocked(auth.api.updateUser).mockResolvedValue({} as any);

    const result = await updateProfile("Novo Nome");
    expect(result.success).toBe(true);
  });

  it("calls auth.api.updateUser with the provided name", async () => {
    vi.mocked(auth.api.updateUser).mockResolvedValue({} as any);

    await updateProfile("Meu Nome");
    expect(auth.api.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ body: { name: "Meu Nome" } })
    );
  });

  it("returns error when auth.api.updateUser throws", async () => {
    vi.mocked(auth.api.updateUser).mockRejectedValue(new Error("API error"));

    const result = await updateProfile("Qualquer");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error).toMatch(/atualizar o perfil/);
  });
});
