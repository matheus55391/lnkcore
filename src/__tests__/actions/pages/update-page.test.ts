import { describe, it, expect, vi, beforeEach } from "vitest";

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

const mockSession = { user: { id: "user-1" }, session: { id: "sess-1" } };

const existingPage = { id: "page-1", userId: "user-1" };
const updatedPage = {
  id: "page-1",
  title: "Título Novo",
  slug: "meu-perfil",
  userId: "user-1",
  bio: null,
  image: null,
  published: true,
  themeId: 1,
};

const validInput = {
  id: "page-1",
  title: "Título Novo",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
  vi.mocked(prisma.page.findUnique).mockResolvedValue(existingPage as any);
  vi.mocked(prisma.page.update).mockResolvedValue(updatedPage as any);
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
    } as any);
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
