import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { Page, Link } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { getPage } from "@/actions/pages/get-page";

type PageWithLinksAndCount = Page & { links: Link[]; _count: { links: number } };

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

const mockDbPage: PageWithLinksAndCount = {
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
  links: [
    {
      id: "link-1",
      title: "GitHub",
      url: "https://github.com",
      image: null,
      active: true,
      position: 0,
      createdAt: BASE_DATE,
      updatedAt: BASE_DATE,
      pageId: "page-1",
    },
  ],
  _count: { links: 1 },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
});

describe("getPage", () => {
  it("returns page with linksCount when found", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue(mockDbPage);

    const result = await getPage("page-1");
    expect(result).not.toBeNull();
    expect(result?.linksCount).toBe(1);
    expect(result).not.toHaveProperty("_count");
  });

  it("returns null when page is not found", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue(null);
    const result = await getPage("page-999");
    expect(result).toBeNull();
  });

  it("queries by pageId and userId", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue(mockDbPage);
    await getPage("page-1");
    expect(prisma.page.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "page-1", userId: "user-1" },
      })
    );
  });

  it("includes links in the result", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue(mockDbPage);
    const result = await getPage("page-1");
    expect(result?.links).toHaveLength(1);
    expect(result?.links?.[0].title).toBe("GitHub");
  });

  it("strips _count from the returned object", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue(mockDbPage);
    const result = await getPage("page-1");
    expect(result).not.toHaveProperty("_count");
  });
});
