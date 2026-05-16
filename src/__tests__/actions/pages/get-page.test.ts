import { describe, it, expect, vi, beforeEach } from "vitest";

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

const mockSession = { user: { id: "user-1" }, session: { id: "sess-1" } };

const mockDbPage = {
  id: "page-1",
  slug: "meu-perfil",
  title: "Meu Perfil",
  userId: "user-1",
  bio: null,
  image: null,
  published: true,
  themeId: 1,
  links: [{ id: "link-1", title: "GitHub", url: "https://github.com" }],
  _count: { links: 1 },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
});

describe("getPage", () => {
  it("returns page with linksCount when found", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue(mockDbPage as any);

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
    vi.mocked(prisma.page.findFirst).mockResolvedValue(mockDbPage as any);
    await getPage("page-1");
    expect(prisma.page.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "page-1", userId: "user-1" },
      })
    );
  });

  it("includes links in the result", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue(mockDbPage as any);
    const result = await getPage("page-1");
    expect(result?.links).toHaveLength(1);
    expect(result?.links?.[0].title).toBe("GitHub");
  });

  it("strips _count from the returned object", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue(mockDbPage as any);
    const result = await getPage("page-1");
    expect(result).not.toHaveProperty("_count");
  });
});
