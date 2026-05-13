"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import type { Page } from "@/@types";

export type PageDetail = Page & { linksCount: number };

export async function getPage(pageId: string): Promise<PageDetail | null> {
  const session = await requireSession();

  const page = await prisma.page.findFirst({
    where: { id: pageId, userId: session.user.id },
    include: {
      links: true,
      _count: {
        select: { links: true }
      }
    },
  });

  if (!page) return null;

  const { _count, ...rest } = page;
  return { ...rest, linksCount: _count.links };
}
