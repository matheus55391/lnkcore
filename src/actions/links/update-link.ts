"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { updateLinkSchema, type UpdateLinkInput } from "@/schemas/links";
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

  const updated = await prisma.link.update({
    where: { id },
    data: {
      title: data.title,
      url: data.url,
      image: data.image ?? null,
      active: data.active,
      position: data.position,
    },
  });
  return { success: true, data: updated };
}
