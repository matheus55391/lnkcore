import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  page: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { getPageByUserId, updatePageByUserId } from "./service";

describe("page service", () => {
  beforeEach(() => {
    prismaMock.page.findFirst.mockReset();
    prismaMock.page.findUnique.mockReset();
    prismaMock.page.create.mockReset();
    prismaMock.page.update.mockReset();
    prismaMock.user.findUnique.mockReset();
  });

  it("returns existing page when found", async () => {
    prismaMock.page.findFirst.mockResolvedValueOnce({ id: "page_1" });

    const page = await getPageByUserId("user_1");

    expect(page).toEqual({ id: "page_1" });
    expect(prismaMock.page.create).not.toHaveBeenCalled();
  });

  it("creates default page when missing", async () => {
    prismaMock.page.findFirst.mockResolvedValueOnce(null);
    prismaMock.user.findUnique.mockResolvedValueOnce({ name: "Matheus" });
    prismaMock.page.findUnique.mockResolvedValueOnce(null);
    prismaMock.page.create.mockResolvedValueOnce({ id: "page_created" });

    const page = await getPageByUserId("user_1");

    expect(page).toEqual({ id: "page_created" });
    expect(prismaMock.page.create).toHaveBeenCalled();
  });

  it("updates page by user ownership", async () => {
    prismaMock.page.findFirst.mockResolvedValueOnce({
      id: "page_1",
      userId: "user_1",
    });
    prismaMock.page.update.mockResolvedValueOnce({
      id: "page_1",
      slug: "novo-slug",
    });

    const updated = await updatePageByUserId("user_1", {
      slug: "novo-slug",
      title: "Novo titulo",
      description: "",
      avatarUrl: "",
    });

    expect(updated).toEqual({ id: "page_1", slug: "novo-slug" });
    expect(prismaMock.page.update).toHaveBeenCalledWith({
      where: { id: "page_1" },
      data: {
        slug: "novo-slug",
        title: "Novo titulo",
        description: null,
        avatarUrl: null,
      },
    });
  });
});
