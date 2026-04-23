"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { deletePageSchema, type DeletePageInput } from "@/schemas/pages";
import type { ActionResult } from "@/@types/action-result";

export async function deletePage(
  input: DeletePageInput
): Promise<ActionResult> {
  const parsed = deletePageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await requireSession();
  const page = await prisma.page.findUnique({ where: { id: parsed.data.id } });
  if (!page || page.userId !== session.user.id) {
    return { success: false, error: "Página não encontrada." };
  }

  await prisma.page.delete({ where: { id: parsed.data.id } });
  return { success: true };
}
