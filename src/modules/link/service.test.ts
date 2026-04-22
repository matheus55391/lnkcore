import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  link: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const pageServiceMock = vi.hoisted(() => ({
  getPageByUserId: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("../page/service", () => pageServiceMock);

import {
  createUserLink,
  deleteUserLink,
  listUserLinks,
  updateUserLink,
} from "./service";

describe("link service", () => {
  beforeEach(() => {
    pageServiceMock.getPageByUserId.mockResolvedValue({ id: "page_1" });
  });

  it("lists links sorted by position", async () => {
    prismaMock.link.findMany.mockResolvedValueOnce([{ id: "l1", position: 0 }]);

    const result = await listUserLinks("user_1");

    expect(result).toEqual([{ id: "l1", position: 0 }]);
    expect(prismaMock.link.findMany).toHaveBeenCalledWith({
      where: { pageId: "page_1" },
      orderBy: { position: "asc" },
    });
  });

  it("creates link with next position", async () => {
    prismaMock.link.findFirst.mockResolvedValueOnce({ position: 2 });
    prismaMock.link.create.mockResolvedValueOnce({ id: "link_1", position: 3 });

    const result = await createUserLink("user_1", {
      title: "Meu site",
      url: "https://lnkcore.com.br",
    });

    expect(result).toEqual({ id: "link_1", position: 3 });
    expect(prismaMock.link.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ pageId: "page_1", position: 3 }),
      }),
    );
  });

  it("throws for invalid url", async () => {
    await expect(
      createUserLink("user_1", { title: "Bad", url: "javascript:alert(1)" }),
    ).rejects.toThrow("Invalid URL");
  });

  it("updates only user owned link", async () => {
    prismaMock.link.findFirst.mockResolvedValueOnce({
      id: "link_1",
      title: "Old",
      description: null,
      url: "https://old.com",
      imageUrl: null,
      position: 0,
    });
    prismaMock.link.update.mockResolvedValueOnce({
      id: "link_1",
      title: "New",
    });

    const result = await updateUserLink("user_1", "link_1", {
      title: "New",
      url: "https://new.com",
    });

    expect(result).toEqual({ id: "link_1", title: "New" });
    expect(prismaMock.link.update).toHaveBeenCalled();
  });

  it("deletes owned link", async () => {
    prismaMock.link.findFirst.mockResolvedValueOnce({ id: "link_1" });
    prismaMock.link.delete.mockResolvedValueOnce({ id: "link_1" });

    await deleteUserLink("user_1", "link_1");

    expect(prismaMock.link.delete).toHaveBeenCalledWith({
      where: { id: "link_1" },
    });
  });
});
