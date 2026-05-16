import { describe, it, expect, vi, beforeEach } from "vitest";

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

const mockSession = { user: { id: "user-1" }, session: { id: "sess-1" } };

const mockLinks = [
  { id: "link-1", title: "Site A", url: "https://a.com", position: 0 },
  { id: "link-2", title: "Site B", url: "https://b.com", position: 1 },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
});

describe("listLinks", () => {
  it("returns links ordered by position when page belongs to user", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue({ userId: "user-1" } as any);
    vi.mocked(prisma.link.findMany).mockResolvedValue(mockLinks as any);

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
    vi.mocked(prisma.page.findUnique).mockResolvedValue({ userId: "other-user" } as any);
    const result = await listLinks("page-1");
    expect(result).toEqual([]);
    expect(prisma.link.findMany).not.toHaveBeenCalled();
  });

  it("returns empty array when page has no links", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue({ userId: "user-1" } as any);
    vi.mocked(prisma.link.findMany).mockResolvedValue([]);

    const result = await listLinks("page-1");
    expect(result).toEqual([]);
  });

  it("queries links with correct pageId", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue({ userId: "user-1" } as any);
    vi.mocked(prisma.link.findMany).mockResolvedValue(mockLinks as any);

    await listLinks("page-1");
    expect(prisma.link.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { pageId: "page-1" } })
    );
  });
});
