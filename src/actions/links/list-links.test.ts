import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { Page, Link } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: { findUnique: vi.fn() },
    link: { findMany: vi.fn() },
  },
}));

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { listLinks } from "@/actions/links/list-links";

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

const mockPage: Page = {
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

const mockLinks: Link[] = [
  {
    id: "link-1",
    title: "Site A",
    url: "https://a.com",
    image: null,
    active: true,
    position: 0,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
    pageId: "page-1",
  },
  {
    id: "link-2",
    title: "Site B",
    url: "https://b.com",
    image: null,
    active: true,
    position: 1,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
    pageId: "page-1",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
});

describe("listLinks", () => {
  it("returns links ordered by position when page belongs to user", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage);
    vi.mocked(prisma.link.findMany).mockResolvedValue(mockLinks);

    const result = await listLinks("page-1");
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Site A");
  });

  it("returns empty array when page is not found", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(null);
    const result = await listLinks("page-999");
    expect(result).toEqual([]);
    expect(prisma.link.findMany).not.toHaveBeenCalled();
  });

  it("returns empty array when page belongs to another user", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue({ ...mockPage, userId: "other-user" });
    const result = await listLinks("page-1");
    expect(result).toEqual([]);
    expect(prisma.link.findMany).not.toHaveBeenCalled();
  });

  it("returns empty array when page has no links", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage);
    vi.mocked(prisma.link.findMany).mockResolvedValue([]);

    const result = await listLinks("page-1");
    expect(result).toEqual([]);
  });

  it("queries links with correct pageId", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage);
    vi.mocked(prisma.link.findMany).mockResolvedValue(mockLinks);

    await listLinks("page-1");
    expect(prisma.link.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { pageId: "page-1" } })
    );
  });
});
