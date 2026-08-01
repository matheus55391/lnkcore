"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { updateLinkSchema, type UpdateLinkInput } from "@/schemas/links";
import { deleteStoredImage } from "@/lib/storage-cleanup";
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

  const nextImage =
    data.image === undefined ? link.image : data.image;

  const updated = await prisma.link.update({
    where: { id },
    data: {
      title: data.title,
      url: data.url,
      image: data.image === undefined ? undefined : data.image,
      emoji: data.emoji === undefined ? undefined : data.emoji,
      type: data.type,
      active: data.active,
      position: data.position,
    },
  });

  if (link.image && link.image !== nextImage) {
    deleteStoredImage(link.image);
  }

  return { success: true, data: updated };
}
