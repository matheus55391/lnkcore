import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/utils/session", () => ({
  requireSession: vi.fn(),
}));

vi.mock("@/lib/plan", () => {
  class PlanLimitError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PlanLimitError";
    }
  }
  return {
    assertCanCreatePage: vi.fn(),
    PlanLimitError,
  };
});

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { assertCanCreatePage, PlanLimitError } from "@/lib/plan";
import { createPage } from "@/actions/pages/create-page";

const mockSession = { user: { id: "user-1" }, session: { id: "sess-1" } };

const mockPage = {
  id: "page-1",
  slug: "meu-perfil",
  title: "meu-perfil",
  userId: "user-1",
  published: true,
  themeId: 1,
  bio: null,
  image: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
  vi.mocked(assertCanCreatePage).mockResolvedValue();
  vi.mocked(prisma.page.findUnique).mockResolvedValue(null); // slug not taken
  vi.mocked(prisma.page.create).mockResolvedValue(mockPage as any);
});

describe("createPage", () => {
  it("creates and returns a page on success", async () => {
    const result = await createPage({ slug: "meu-perfil" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.slug).toBe("meu-perfil");
  });

  it("sets title equal to slug on creation", async () => {
    await createPage({ slug: "meu-perfil" });
    expect(prisma.page.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "meu-perfil", title: "meu-perfil" }),
      })
    );
  });

  it("returns validation error for slug shorter than 3 chars", async () => {
    const result = await createPage({ slug: "ab" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/3 caracteres/);
    expect(prisma.page.create).not.toHaveBeenCalled();
  });

  it("returns validation error for slug with uppercase letters", async () => {
    const result = await createPage({ slug: "MeuPerfil" });
    expect(result.success).toBe(false);
    expect(prisma.page.create).not.toHaveBeenCalled();
  });

  it("returns error when slug is already taken", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage as any);
    const result = await createPage({ slug: "meu-perfil" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/slug já está em uso/);
    expect(prisma.page.create).not.toHaveBeenCalled();
  });

  it("returns error when plan limit is reached", async () => {
    vi.mocked(assertCanCreatePage).mockRejectedValue(
      new PlanLimitError("Limite de páginas atingido")
    );
    const result = await createPage({ slug: "meu-perfil" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe("Limite de páginas atingido");
  });

  it("re-throws unexpected errors", async () => {
    vi.mocked(assertCanCreatePage).mockRejectedValue(new Error("DB crash"));
    await expect(createPage({ slug: "meu-perfil" })).rejects.toThrow("DB crash");
  });
});
