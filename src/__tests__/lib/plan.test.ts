import { describe, it, expect, vi, beforeEach } from "vitest";

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PLAN_LIMITS", () => {
  it("FREE plan has maxPages=1, maxLinksPerPage=10", () => {
    expect(PLAN_LIMITS.FREE.maxPages).toBe(1);
    expect(PLAN_LIMITS.FREE.maxLinksPerPage).toBe(10);
  });

  it("PRO plan has maxPages=100, maxLinksPerPage=500", () => {
    expect(PLAN_LIMITS.PRO.maxPages).toBe(100);
    expect(PLAN_LIMITS.PRO.maxLinksPerPage).toBe(500);
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
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "FREE" } as any);
    vi.mocked(prisma.page.count).mockResolvedValue(0);
    await expect(assertCanCreatePage("user-1")).resolves.toBeUndefined();
  });

  it("throws PlanLimitError when FREE user already has 1 page", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "FREE" } as any);
    vi.mocked(prisma.page.count).mockResolvedValue(1);
    await expect(assertCanCreatePage("user-1")).rejects.toBeInstanceOf(PlanLimitError);
  });

  it("does NOT throw when PRO user has 99 pages", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "PRO" } as any);
    vi.mocked(prisma.page.count).mockResolvedValue(99);
    await expect(assertCanCreatePage("user-1")).resolves.toBeUndefined();
  });

  it("throws PlanLimitError when PRO user reaches 100-page limit", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "PRO" } as any);
    vi.mocked(prisma.page.count).mockResolvedValue(100);
    await expect(assertCanCreatePage("user-1")).rejects.toBeInstanceOf(PlanLimitError);
  });
});

describe("assertCanCreateLink", () => {
  it("does NOT throw when FREE user has 0 links", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "FREE" } as any);
    vi.mocked(prisma.link.count).mockResolvedValue(0);
    await expect(assertCanCreateLink("user-1", "page-1")).resolves.toBeUndefined();
  });

  it("throws PlanLimitError when FREE user reaches 10-link limit", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "FREE" } as any);
    vi.mocked(prisma.link.count).mockResolvedValue(10);
    await expect(assertCanCreateLink("user-1", "page-1")).rejects.toBeInstanceOf(PlanLimitError);
  });

  it("does NOT throw when PRO user has 499 links", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "PRO" } as any);
    vi.mocked(prisma.link.count).mockResolvedValue(499);
    await expect(assertCanCreateLink("user-1", "page-1")).resolves.toBeUndefined();
  });

  it("throws PlanLimitError when PRO user reaches 500-link limit", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "PRO" } as any);
    vi.mocked(prisma.link.count).mockResolvedValue(500);
    await expect(assertCanCreateLink("user-1", "page-1")).rejects.toBeInstanceOf(PlanLimitError);
  });

  it("error message contains the link limit", async () => {
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue({ plan: "FREE" } as any);
    vi.mocked(prisma.link.count).mockResolvedValue(10);
    try {
      await assertCanCreateLink("user-1", "page-1");
    } catch (err) {
      expect((err as Error).message).toMatch(/10/);
    }
  });
});
