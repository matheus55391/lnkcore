import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: {
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
import { deletePage } from "@/actions/pages/delete-page";

const mockSession = { user: { id: "user-1" }, session: { id: "sess-1" } };
const existingPage = { id: "page-1", userId: "user-1" };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
  vi.mocked(prisma.page.findUnique).mockResolvedValue(existingPage as any);
  vi.mocked(prisma.page.delete).mockResolvedValue({} as any);
});

describe("deletePage", () => {
  it("returns success and deletes the page", async () => {
    const result = await deletePage({ id: "page-1" });
    expect(result.success).toBe(true);
    expect(prisma.page.delete).toHaveBeenCalledWith({ where: { id: "page-1" } });
  });

  it("returns validation error for empty id", async () => {
    const result = await deletePage({ id: "" });
    expect(result.success).toBe(false);
    expect(prisma.page.delete).not.toHaveBeenCalled();
  });

  it("returns error when page is not found", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(null);
    const result = await deletePage({ id: "page-999" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Página não encontrada/);
    expect(prisma.page.delete).not.toHaveBeenCalled();
  });

  it("returns error when page belongs to another user", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue({
      ...existingPage,
      userId: "other-user",
    } as any);
    const result = await deletePage({ id: "page-1" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Página não encontrada/);
    expect(prisma.page.delete).not.toHaveBeenCalled();
  });
});
