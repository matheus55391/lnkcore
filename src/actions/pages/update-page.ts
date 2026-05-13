"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { updatePageSchema, type UpdatePageInput } from "@/schemas/pages";
import type { ActionResult } from "@/@types/action-result";
import type { Page } from "@/@types";

export async function updatePage(
  input: UpdatePageInput
): Promise<ActionResult<Page>> {
  const parsed = updatePageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await requireSession();
  const { id, ...data } = parsed.data;

  const page = await prisma.page.findUnique({ where: { id } });
  if (!page || page.userId !== session.user.id) {
    return { success: false, error: "Página não encontrada." };
  }

  const updated = await prisma.page.update({ where: { id }, data });
  return { success: true, data: updated };
}
