import { describe, it, expect, vi, beforeEach } from "vitest";

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

const mockSession = { user: { id: "user-1" }, session: { id: "sess-1" } };

const existingLink = {
  id: "link-1",
  title: "Old Title",
  url: "https://old.com",
  image: null,
  active: true,
  position: 0,
  page: { userId: "user-1" },
};

const updatedLink = {
  id: "link-1",
  title: "New Title",
  url: "https://new.com",
  image: null,
  active: true,
  position: 0,
};

const validInput = {
  id: "link-1",
  title: "New Title",
  url: "https://new.com",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireSession).mockResolvedValue(mockSession as any);
  vi.mocked(prisma.link.findUnique).mockResolvedValue(existingLink as any);
  vi.mocked(prisma.link.update).mockResolvedValue(updatedLink as any);
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
    vi.mocked(prisma.link.findUnique).mockResolvedValue({
      ...existingLink,
      page: { userId: "other-user" },
    } as any);
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
