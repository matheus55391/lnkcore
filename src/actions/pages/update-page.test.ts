import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { Page } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { updatePage } from "@/actions/pages/update-page";

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

const updatedPage: Page = {
  ...existingPage,
  title: "Título Novo",
};

const validInput = {
  id: "page-1",
  title: "Título Novo",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
  vi.mocked(prisma.page.findUnique).mockResolvedValue(existingPage);
  vi.mocked(prisma.page.update).mockResolvedValue(updatedPage);
});

describe("updatePage", () => {
  it("updates and returns the page on success", async () => {
    const result = await updatePage(validInput);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.title).toBe("Título Novo");
  });

  it("calls prisma.page.update with the correct id", async () => {
    await updatePage(validInput);
    expect(prisma.page.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "page-1" } })
    );
  });

  it("returns validation error for empty title", async () => {
    const result = await updatePage({ ...validInput, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Título obrigatório/);
    expect(prisma.page.update).not.toHaveBeenCalled();
  });

  it("returns validation error for invalid image URL", async () => {
    const result = await updatePage({ ...validInput, image: "bad-url" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/URL inválida/);
  });

  it("returns error when page is not found", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(null);
    const result = await updatePage(validInput);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Página não encontrada/);
    expect(prisma.page.update).not.toHaveBeenCalled();
  });

  it("returns error when page belongs to another user", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue({
      ...existingPage,
      userId: "other-user",
    });
    const result = await updatePage(validInput);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Página não encontrada/);
  });

  it("accepts optional fields: bio, image, published, themeId", async () => {
    const result = await updatePage({
      ...validInput,
      bio: "Minha bio",
      image: "https://cdn.example.com/img.jpg",
      published: false,
      themeId: 3,
    });
    expect(result.success).toBe(true);
  });
});
