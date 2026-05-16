import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { User } from "@/generated/prisma";

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

const mockDbUser: User = {
  id: "user-1",
  name: "Test User",
  email: "test@test.com",
  emailVerified: true,
  image: null,
  createdAt: BASE_DATE,
  updatedAt: BASE_DATE,
  plan: "FREE",
  stripeCustomerId: null,
  stripeSubscriptionId: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
});

describe("getCurrentUser", () => {
  it("returns the current user on success", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockDbUser);

    const result = await getCurrentUser();
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("user-1");
      expect(result.data.plan).toBe("FREE");
    }
  });

  it("uses the session user id to query the database", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockDbUser);

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
