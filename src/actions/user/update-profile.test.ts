import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";

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

describe("updateProfile", () => {
  it("returns success when auth.api.updateUser succeeds", async () => {
    const result = await updateProfile("Novo Nome");
    expect(result.success).toBe(true);
  });

  it("calls auth.api.updateUser with the provided name", async () => {
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
