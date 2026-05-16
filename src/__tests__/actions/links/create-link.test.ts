import { describe, it, expect, vi, beforeEach } from "vitest";

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

const mockSession = {
  user: { id: "user-1" },
  session: { id: "sess-1" },
};

const validInput = {
  pageId: "page-1",
  title: "GitHub",
  url: "https://github.com",
};

const mockPage = { id: "page-1", userId: "user-1" };
const mockLink = {
  id: "link-1",
  pageId: "page-1",
  title: "GitHub",
  url: "https://github.com",
  image: null,
  active: true,
  position: 0,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
  vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage as any);
  vi.mocked(assertCanCreateLink).mockResolvedValue();
  vi.mocked(prisma.link.findFirst).mockResolvedValue(null);
  vi.mocked(prisma.link.create).mockResolvedValue(mockLink as any);
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
    vi.mocked(prisma.link.findFirst).mockResolvedValue({ position: 4 } as any);
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
      id: "page-1",
      userId: "other-user",
    } as any);
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
