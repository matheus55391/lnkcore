import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUniqueOrThrow: vi.fn(),
    },
  },
}));

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { getCurrentUser } from "@/actions/user/get-current-user";

const mockSession = {
  user: { id: "user-1", name: "Test", email: "test@test.com" },
  session: { id: "sess-1", token: "tok", userId: "user-1", expiresAt: new Date() },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
});

describe("getCurrentUser", () => {
  it("returns the current user on success", async () => {
    const dbUser = {
      id: "user-1",
      name: "Test",
      email: "test@test.com",
      plan: "FREE" as const,
    };
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(dbUser as any);

    const result = await getCurrentUser();
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("user-1");
      expect(result.data.plan).toBe("FREE");
    }
  });

  it("uses the session user id to query the database", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({
      id: "user-1",
      name: "Test",
      email: "test@test.com",
      plan: "FREE",
    } as any);

    await getCurrentUser();

    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "user-1" } })
    );
  });

  it("propagates database errors", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockRejectedValue(
      new Error("DB error")
    );
    await expect(getCurrentUser()).rejects.toThrow("DB error");
  });
});
