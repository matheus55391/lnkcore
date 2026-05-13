"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { assertCanCreateLink, PlanLimitError } from "@/lib/plan";
import { createLinkSchema, type CreateLinkInput } from "@/schemas/links";
import type { ActionResult } from "@/@types/action-result";
import type { Link } from "@/@types";

export async function createLink(
  input: CreateLinkInput
): Promise<ActionResult<Link>> {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await requireSession();
  const { pageId, title, url, image } = parsed.data;

  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page || page.userId !== session.user.id) {
    return { success: false, error: "Página não encontrada." };
  }

  try {
    await assertCanCreateLink(session.user.id, pageId);

    const last = await prisma.link.findFirst({
      where: { pageId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const position = (last?.position ?? -1) + 1;

    const link = await prisma.link.create({
      data: { pageId, title, url, image: image ?? null, position },
    });

    return { success: true, data: link };
  } catch (err) {
    if (err instanceof PlanLimitError) {
      return { success: false, error: err.message };
    }
    throw err;
  }
}
