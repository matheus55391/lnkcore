"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import {
  assertOwnedImageUrl,
  deleteOwnedStoredImage,
  OwnedImageError,
} from "@/lib/storage-cleanup";
import type { ActionResult } from "@/@types/action-result";
import type { Page } from "@/@types";

export async function uploadPageImage(
  pageId: string,
  imageUrl: string
): Promise<ActionResult<Page>> {
  const session = await requireSession();

  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page || page.userId !== session.user.id) {
    return { success: false, error: "Página não encontrada." };
  }

  try {
    assertOwnedImageUrl(imageUrl, session.user.id);
  } catch (err) {
    if (err instanceof OwnedImageError) {
      return { success: false, error: err.message };
    }
    throw err;
  }

  const oldImageUrl = page.image;

  const updated = await prisma.page.update({
    where: { id: pageId },
    data: { image: imageUrl },
  });

  if (oldImageUrl && oldImageUrl !== imageUrl) {
    deleteOwnedStoredImage(oldImageUrl, session.user.id);
  }

  return { success: true, data: updated };
}
