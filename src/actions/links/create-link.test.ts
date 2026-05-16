import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { Page, Link } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: { findUnique: vi.fn() },
    link: {
      findFirst: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
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
    assertCanCreateLink: vi.fn(),
    PlanLimitError,
    PLAN_LIMITS: {
      FREE: { maxPages: 1, maxLinksPerPage: 10, maxStoredImages: 6 },
      PRO: { maxPages: 100, maxLinksPerPage: 500, maxStoredImages: 5000 },
    },
  };
});

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { assertCanCreateLink, PlanLimitError } from "@/lib/plan";
import { createLink } from "@/actions/links/create-link";

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

const validInput = {
  pageId: "page-1",
  title: "GitHub",
  url: "https://github.com",
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

const mockLink: Link = {
  id: "link-1",
  title: "GitHub",
  url: "https://github.com",
  image: null,
  active: true,
  position: 0,
  createdAt: BASE_DATE,
  updatedAt: BASE_DATE,
  pageId: "page-1",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
  vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage);
  vi.mocked(assertCanCreateLink).mockResolvedValue();
  vi.mocked(prisma.link.findFirst).mockResolvedValue(null);
  vi.mocked(prisma.link.create).mockResolvedValue(mockLink);
});

describe("createLink", () => {
  it("creates and returns a link on success", async () => {
    const result = await createLink(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("GitHub");
      expect(result.data.url).toBe("https://github.com");
    }
  });

  it("assigns position 0 when no previous link exists", async () => {
    vi.mocked(prisma.link.findFirst).mockResolvedValue(null);
    await createLink(validInput);
    expect(prisma.link.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ position: 0 }) })
    );
  });

  it("assigns position after the last link", async () => {
    vi.mocked(prisma.link.findFirst).mockResolvedValue({ ...mockLink, position: 4 });
    await createLink(validInput);
    expect(prisma.link.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ position: 5 }) })
    );
  });

  it("returns validation error for invalid URL", async () => {
    const result = await createLink({ ...validInput, url: "not-a-url" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/URL inválida/);
    expect(prisma.link.create).not.toHaveBeenCalled();
  });

  it("returns validation error for empty title", async () => {
    const result = await createLink({ ...validInput, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Título obrigatório/);
  });

  it("returns error when page is not found", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(null);
    const result = await createLink(validInput);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Página não encontrada/);
  });

  it("returns error when page belongs to another user", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue({
      ...mockPage,
      userId: "other-user",
    });
    const result = await createLink(validInput);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Página não encontrada/);
  });

  it("returns error when plan limit is reached", async () => {
    vi.mocked(assertCanCreateLink).mockRejectedValue(
      new PlanLimitError("Limite atingido")
    );
    const result = await createLink(validInput);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe("Limite atingido");
  });

  it("re-throws unexpected errors", async () => {
    vi.mocked(assertCanCreateLink).mockRejectedValue(new Error("DB crash"));
    await expect(createLink(validInput)).rejects.toThrow("DB crash");
  });
});
