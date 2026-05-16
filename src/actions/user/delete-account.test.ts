import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { User } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { deleteAccount } from "@/actions/user/delete-account";

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

const mockUserBase: User = {
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

describe("deleteAccount", () => {
  it("returns success and deletes user when no active subscription", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserBase);

    const result = await deleteAccount();
    expect(result.success).toBe(true);
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "user-1" } });
  });

  it("returns error when user has active Stripe subscription", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUserBase,
      stripeSubscriptionId: "sub_active_123",
    });

    const result = await deleteAccount();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/PRO/);
      expect(result.error).toMatch(/Cancele/);
    }
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it("returns error when user is not found in database", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await deleteAccount();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Usuário não encontrado/);
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it("does not call delete when subscription exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUserBase,
      stripeSubscriptionId: "sub_xyz",
    });

    await deleteAccount();
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });
});
