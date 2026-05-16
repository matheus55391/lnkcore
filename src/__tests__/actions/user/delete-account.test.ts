import { describe, it, expect, vi, beforeEach } from "vitest";

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

const mockSession = {
  user: { id: "user-1" },
  session: { id: "sess-1" },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
});

describe("deleteAccount", () => {
  it("returns success and deletes user when no active subscription", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      stripeSubscriptionId: null,
    } as any);
    vi.mocked(prisma.user.delete).mockResolvedValue({} as any);

    const result = await deleteAccount();
    expect(result.success).toBe(true);
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "user-1" } });
  });

  it("returns error when user has active Stripe subscription", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      stripeSubscriptionId: "sub_active_123",
    } as any);

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
      stripeSubscriptionId: "sub_xyz",
    } as any);

    await deleteAccount();
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });
});
