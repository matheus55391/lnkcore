"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import type { Link } from "@/@types";

export async function listLinks(pageId: string): Promise<Link[]> {
  const session = await requireSession();
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: { userId: true },
  });
  if (!page || page.userId !== session.user.id) {
    return [];
  }

  return prisma.link.findMany({
    where: { pageId },
    orderBy: { position: "asc" },
  });
}
