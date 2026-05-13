"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { deleteLinkSchema, type DeleteLinkInput } from "@/schemas/links";
import type { ActionResult } from "@/@types/action-result";

export async function deleteLink(
  input: DeleteLinkInput
): Promise<ActionResult> {
  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const session = await requireSession();
  const link = await prisma.link.findUnique({
    where: { id: parsed.data.id },
    include: { page: { select: { userId: true } } },
  });
  if (!link || link.page.userId !== session.user.id) {
    return { success: false, error: "Link não encontrado." };
  }

  await prisma.link.delete({ where: { id: parsed.data.id } });
  return { success: true };
}
