"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
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

  const updated = await prisma.page.update({
    where: { id: pageId },
    data: { image: imageUrl },
  });

  return { success: true, data: updated };
}
