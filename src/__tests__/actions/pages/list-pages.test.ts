import { describe, it, expect, vi, beforeEach } from "vitest";

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

const mockSession = { user: { id: "user-1" }, session: { id: "sess-1" } };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
});

describe("listPages", () => {
  it("returns pages with linksCount for the current user", async () => {
    vi.mocked(prisma.page.findMany).mockResolvedValue([
      {
        id: "page-1",
        slug: "meu-perfil",
        title: "Meu Perfil",
        userId: "user-1",
        _count: { links: 3 },
      },
    ] as any);

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
    vi.mocked(prisma.page.findMany).mockResolvedValue([
      { id: "page-1", _count: { links: 5 } },
      { id: "page-2", _count: { links: 0 } },
    ] as any);

    const result = await listPages();
    expect(result[0].linksCount).toBe(5);
    expect(result[1].linksCount).toBe(0);
  });
});
