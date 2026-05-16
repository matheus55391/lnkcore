import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { Page } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { listPages } from "@/actions/pages/list-pages";

type PageWithCount = Page & { _count: { links: number } };

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

const mockPageBase: Page = {
  id: "page-1",
  slug: "meu-perfil",
  title: "Meu Perfil",
  bio: null,
  image: null,
  published: true,
  themeId: 1,
  createdAt: BASE_DATE,
  updatedAt: BASE_DATE,
  userId: "user-1",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
});

describe("listPages", () => {
  it("returns pages with linksCount for the current user", async () => {
    const pages: PageWithCount[] = [
      { ...mockPageBase, _count: { links: 3 } },
    ];
    vi.mocked(prisma.page.findMany).mockResolvedValue(pages);

    const result = await listPages();
    expect(result).toHaveLength(1);
    expect(result[0].linksCount).toBe(3);
    expect(result[0]).not.toHaveProperty("_count");
  });

  it("returns empty array when user has no pages", async () => {
    vi.mocked(prisma.page.findMany).mockResolvedValue([]);
    const result = await listPages();
    expect(result).toEqual([]);
  });

  it("queries pages filtered by the session userId", async () => {
    vi.mocked(prisma.page.findMany).mockResolvedValue([]);
    await listPages();
    expect(prisma.page.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } })
    );
  });

  it("orders pages by createdAt descending", async () => {
    vi.mocked(prisma.page.findMany).mockResolvedValue([]);
    await listPages();
    expect(prisma.page.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "desc" } })
    );
  });

  it("maps linksCount correctly for multiple pages", async () => {
    const pages: PageWithCount[] = [
      { ...mockPageBase, id: "page-1", _count: { links: 5 } },
      { ...mockPageBase, id: "page-2", _count: { links: 0 } },
    ];
    vi.mocked(prisma.page.findMany).mockResolvedValue(pages);

    const result = await listPages();
    expect(result[0].linksCount).toBe(5);
    expect(result[1].linksCount).toBe(0);
  });
});
