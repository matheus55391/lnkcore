import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";
import type { Link } from "@/generated/prisma";

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
  title: "GitHub",
  url: "https://github.com",
  image: null,
  active: true,
  position: 0,
  createdAt: BASE_DATE,
  updatedAt: BASE_DATE,
  pageId: "page-1",
  page: { userId: "user-1" },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession);
  vi.mocked(prisma.link.findUnique).mockResolvedValue(existingLink);
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
    const otherUserLink: LinkWithPage = { ...existingLink, page: { userId: "other-user" } };
    vi.mocked(prisma.link.findUnique).mockResolvedValue(otherUserLink);
    const result = await deleteLink({ id: "link-1" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Link não encontrado/);
    expect(prisma.link.delete).not.toHaveBeenCalled();
  });
});
