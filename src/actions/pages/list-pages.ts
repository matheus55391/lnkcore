"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import type { Page } from "@/@types";

export type PageListItem = Page & { linksCount: number };

export async function listPages(): Promise<PageListItem[]> {
  const session = await requireSession();
  const pages = await prisma.page.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { links: true } } },
  });

  return pages.map(({ _count, ...rest }) => ({
    ...rest,
    linksCount: _count.links,
  }));
}
