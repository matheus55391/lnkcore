"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { updateLinkSchema, type UpdateLinkInput } from "@/schemas/links";
import {
  deleteOwnedStoredImage,
  normalizeOwnedImageUrl,
  OwnedImageError,
} from "@/lib/storage-cleanup";
import type { ActionResult } from "@/@types/action-result";
import type { Link } from "@/@types";

export async function updateLink(
  input: UpdateLinkInput
): Promise<ActionResult<Link>> {
  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await requireSession();
  const { id, ...data } = parsed.data;

  const link = await prisma.link.findUnique({
    where: { id },
    include: { page: { select: { userId: true } } },
  });
  if (!link || link.page.userId !== session.user.id) {
    return { success: false, error: "Link não encontrado." };
  }

  let nextImage: string | null | undefined;
  try {
    nextImage = normalizeOwnedImageUrl(data.image, session.user.id);
  } catch (err) {
    if (err instanceof OwnedImageError) {
      return { success: false, error: err.message };
    }
    throw err;
  }

  const resolvedImage =
    nextImage === undefined ? link.image : nextImage;

  const updated = await prisma.link.update({
    where: { id },
    data: {
      title: data.title,
      url: data.url,
      image: nextImage === undefined ? undefined : nextImage,
      emoji: data.emoji === undefined ? undefined : data.emoji,
      type: data.type,
      active: data.active,
      position: data.position,
    },
  });

  if (link.image && link.image !== resolvedImage) {
    deleteOwnedStoredImage(link.image, session.user.id);
  }

  return { success: true, data: updated };
}
