import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { Link } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    link: {
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
import { updateLink } from "@/actions/links/update-link";

type LinkWithPage = Link & { page: { userId: string } };

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

const existingLink: LinkWithPage = {
  id: "link-1",
  title: "Old Title",
  url: "https://old.com",
  image: null,
  active: true,
  position: 0,
  createdAt: BASE_DATE,
  updatedAt: BASE_DATE,
  pageId: "page-1",
  page: { userId: "user-1" },
};

const updatedLink: Link = {
  id: "link-1",
  title: "New Title",
  url: "https://new.com",
  image: null,
  active: true,
  position: 0,
  createdAt: BASE_DATE,
  updatedAt: BASE_DATE,
  pageId: "page-1",
};

const validInput = {
  id: "link-1",
  title: "New Title",
  url: "https://new.com",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
  vi.mocked(prisma.link.findUnique).mockResolvedValue(existingLink);
  vi.mocked(prisma.link.update).mockResolvedValue(updatedLink);
});

describe("updateLink", () => {
  it("updates and returns the link on success", async () => {
    const result = await updateLink(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("New Title");
    }
  });

  it("calls prisma.link.update with the correct id", async () => {
    await updateLink(validInput);
    expect(prisma.link.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "link-1" } })
    );
  });

  it("returns validation error for invalid URL", async () => {
    const result = await updateLink({ ...validInput, url: "bad-url" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/URL inválida/);
    expect(prisma.link.update).not.toHaveBeenCalled();
  });

  it("returns validation error for empty title", async () => {
    const result = await updateLink({ ...validInput, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Título obrigatório/);
  });

  it("returns error when link is not found", async () => {
    vi.mocked(prisma.link.findUnique).mockResolvedValue(null);
    const result = await updateLink(validInput);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Link não encontrado/);
    expect(prisma.link.update).not.toHaveBeenCalled();
  });

  it("returns error when link belongs to another user", async () => {
    const otherUserLink: LinkWithPage = { ...existingLink, page: { userId: "other-user" } };
    vi.mocked(prisma.link.findUnique).mockResolvedValue(otherUserLink);
    const result = await updateLink(validInput);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Link não encontrado/);
  });

  it("updates active and position when provided", async () => {
    await updateLink({ ...validInput, active: false, position: 3 });
    expect(prisma.link.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ active: false, position: 3 }),
      })
    );
  });
});
