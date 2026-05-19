import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUniqueOrThrow: vi.fn(),
    },
    page: {
      count: vi.fn(),
    },
    link: {
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  PLAN_LIMITS,
  assertCanCreatePage,
  assertCanCreateLink,
  PlanLimitError,
} from "@/lib/plan";

const BASE_DATE = new Date("2025-01-01");

const mockFreeUser: User = {
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

const mockProUser: User = {
  ...mockFreeUser,
  plan: "PRO",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PLAN_LIMITS", () => {
  it("FREE plan has maxPages=1, maxLinksPerPage=5 and maxStoredImages=10", () => {
    expect(PLAN_LIMITS.FREE.maxPages).toBe(1);
    expect(PLAN_LIMITS.FREE.maxLinksPerPage).toBe(5);
    expect(PLAN_LIMITS.FREE.maxStoredImages).toBe(10);
  });

  it("PRO plan has maxPages=5, maxLinksPerPage=20 and maxStoredImages=40", () => {
    expect(PLAN_LIMITS.PRO.maxPages).toBe(5);
    expect(PLAN_LIMITS.PRO.maxLinksPerPage).toBe(20);
    expect(PLAN_LIMITS.PRO.maxStoredImages).toBe(40);
  });
});

describe("PlanLimitError", () => {
  it("is an instance of Error", () => {
    const err = new PlanLimitError("limite");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(PlanLimitError);
  });

  it("has name 'PlanLimitError'", () => {
    expect(new PlanLimitError("x").name).toBe("PlanLimitError");
  });

  it("carries the provided message", () => {
    expect(new PlanLimitError("mensagem").message).toBe("mensagem");
  });
});

describe("assertCanCreatePage", () => {
  it("does NOT throw when FREE user has 0 pages", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockFreeUser);
    vi.mocked(prisma.page.count).mockResolvedValue(0);
    await expect(assertCanCreatePage("user-1")).resolves.toBeUndefined();
  });

  it("throws PlanLimitError when FREE user already has 1 page", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockFreeUser);
    vi.mocked(prisma.page.count).mockResolvedValue(1);
    await expect(assertCanCreatePage("user-1")).rejects.toBeInstanceOf(PlanLimitError);
  });

  it("does NOT throw when PRO user has 4 pages", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockProUser);
    vi.mocked(prisma.page.count).mockResolvedValue(4);
    await expect(assertCanCreatePage("user-1")).resolves.toBeUndefined();
  });

  it("throws PlanLimitError when PRO user reaches 5-page limit", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockProUser);
    vi.mocked(prisma.page.count).mockResolvedValue(5);
    await expect(assertCanCreatePage("user-1")).rejects.toBeInstanceOf(PlanLimitError);
  });
});

describe("assertCanCreateLink", () => {
  it("does NOT throw when FREE user has 0 links", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockFreeUser);
    vi.mocked(prisma.link.count).mockResolvedValue(0);
    await expect(assertCanCreateLink("user-1", "page-1")).resolves.toBeUndefined();
  });

  it("throws PlanLimitError when FREE user reaches 5-link limit", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockFreeUser);
    vi.mocked(prisma.link.count).mockResolvedValue(5);
    await expect(assertCanCreateLink("user-1", "page-1")).rejects.toBeInstanceOf(PlanLimitError);
  });

  it("does NOT throw when PRO user has 19 links", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockProUser);
    vi.mocked(prisma.link.count).mockResolvedValue(19);
    await expect(assertCanCreateLink("user-1", "page-1")).resolves.toBeUndefined();
  });

  it("throws PlanLimitError when PRO user reaches 20-link limit", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockProUser);
    vi.mocked(prisma.link.count).mockResolvedValue(20);
    await expect(assertCanCreateLink("user-1", "page-1")).rejects.toBeInstanceOf(PlanLimitError);
  });

  it("error message contains the link limit", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(mockFreeUser);
    vi.mocked(prisma.link.count).mockResolvedValue(5);
    try {
      await assertCanCreateLink("user-1", "page-1");
    } catch (err) {
      expect((err as Error).message).toMatch(/5/);
    }
  });
});
