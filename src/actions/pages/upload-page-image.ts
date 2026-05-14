"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { getStorage } from "@/lib/storage";
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

  const oldImageUrl = page.image;

  const updated = await prisma.page.update({
    where: { id: pageId },
    data: { image: imageUrl },
  });

  // Delete old image only after the DB update succeeds
  if (oldImageUrl && oldImageUrl !== imageUrl) {
    const storage = getStorage();
    const oldKey = storage.keyFromUrl(oldImageUrl);
    if (oldKey) {
      // Fire-and-forget — don't fail the request if deletion fails
      storage.delete(oldKey).catch((err) =>
        console.error("[storage] Failed to delete old page image:", oldKey, err)
      );
    }
  }

  return { success: true, data: updated };
}
