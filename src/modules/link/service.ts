import { prisma } from "@/lib/prisma";
import { sanitizeUrl } from "@/lib/url";
import { createLinkSchema, updateLinkSchema } from "@/schemas/link";
import { getPageByUserId } from "../page/service";

async function getUserPageOrThrow(userId: string) {
  const page = await getPageByUserId(userId);
  if (!page) {
    throw new Error("Page not found");
  }
  return page;
}

export async function listUserLinks(userId: string) {
  const page = await getUserPageOrThrow(userId);
  return prisma.link.findMany({
    where: { pageId: page.id },
    orderBy: { position: "asc" },
  });
}

export async function createUserLink(userId: string, input: unknown) {
  const page = await getUserPageOrThrow(userId);
  const payload = createLinkSchema.parse(input);
  const normalizedUrl = sanitizeUrl(payload.url);
  if (!normalizedUrl) {
    throw new Error("Invalid URL");
  }

  const last = await prisma.link.findFirst({
    where: { pageId: page.id },
    orderBy: { position: "desc" },
  });

  return prisma.link.create({
    data: {
      pageId: page.id,
      title: payload.title,
      description: payload.description || null,
      url: normalizedUrl,
      imageUrl: payload.imageUrl || null,
      position: (last?.position ?? -1) + 1,
    },
  });
}

export async function updateUserLink(
  userId: string,
  linkId: string,
  input: unknown,
) {
  const page = await getUserPageOrThrow(userId);
  const payload = updateLinkSchema.parse(input);
  const existing = await prisma.link.findFirst({
    where: { id: linkId, pageId: page.id },
  });
  if (!existing) {
    throw new Error("Link not found");
  }

  const nextUrl = payload.url ? sanitizeUrl(payload.url) : existing.url;
  if (!nextUrl) {
    throw new Error("Invalid URL");
  }

  return prisma.link.update({
    where: { id: existing.id },
    data: {
      title: payload.title ?? existing.title,
      description: payload.description ?? existing.description,
      url: nextUrl,
      imageUrl: payload.imageUrl ?? existing.imageUrl,
      position: payload.position ?? existing.position,
    },
  });
}

export async function deleteUserLink(userId: string, linkId: string) {
  const page = await getUserPageOrThrow(userId);
  const existing = await prisma.link.findFirst({
    where: { id: linkId, pageId: page.id },
  });
  if (!existing) {
    throw new Error("Link not found");
  }

  return prisma.link.delete({ where: { id: existing.id } });
}
