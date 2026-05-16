import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { Page } from "@/generated/prisma";

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

const existingPage: Page = {
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
  vi.mocked(prisma.page.findUnique).mockResolvedValue(existingPage);
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
    });
    const result = await deletePage({ id: "page-1" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Página não encontrada/);
    expect(prisma.page.delete).not.toHaveBeenCalled();
  });
});
