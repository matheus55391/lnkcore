import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    link: {
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
import { deleteLink } from "@/actions/links/delete-link";

const mockSession = { user: { id: "user-1" }, session: { id: "sess-1" } };

const existingLink = {
  id: "link-1",
  page: { userId: "user-1" },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
  vi.mocked(prisma.link.findUnique).mockResolvedValue(existingLink as any);
  vi.mocked(prisma.link.delete).mockResolvedValue({} as any);
});

describe("deleteLink", () => {
  it("returns success and deletes the link", async () => {
    const result = await deleteLink({ id: "link-1" });
    expect(result.success).toBe(true);
    expect(prisma.link.delete).toHaveBeenCalledWith({ where: { id: "link-1" } });
  });

  it("returns validation error for empty id", async () => {
    const result = await deleteLink({ id: "" });
    expect(result.success).toBe(false);
    expect(prisma.link.delete).not.toHaveBeenCalled();
  });

  it("returns error when link is not found", async () => {
    vi.mocked(prisma.link.findUnique).mockResolvedValue(null);
    const result = await deleteLink({ id: "link-999" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Link não encontrado/);
    expect(prisma.link.delete).not.toHaveBeenCalled();
  });

  it("returns error when link belongs to another user", async () => {
    vi.mocked(prisma.link.findUnique).mockResolvedValue({
      id: "link-1",
      page: { userId: "other-user" },
    } as any);
    const result = await deleteLink({ id: "link-1" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Link não encontrado/);
    expect(prisma.link.delete).not.toHaveBeenCalled();
  });
});
