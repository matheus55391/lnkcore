import "server-only";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@/@types";

export const PLAN_LIMITS = {
  FREE: { maxPages: 1, maxLinksPerPage: 10, maxStoredImages: 6 },
  PRO: {
    maxPages: 100,
    maxLinksPerPage: 500,
    maxStoredImages: 5000,
  },
} as const satisfies Record<
  Plan,
  { maxPages: number; maxLinksPerPage: number; maxStoredImages: number }
>;

export async function assertCanCreatePage(userId: string): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { plan: true },
  });
  const limit = PLAN_LIMITS[user.plan].maxPages;
  if (limit === Infinity) return;

  const count = await prisma.page.count({ where: { userId } });
  if (count >= limit) {
    throw new PlanLimitError(
      "Limite do plano gratuito atingido: apenas 1 página permitida."
    );
  }
}

export async function assertCanCreateLink(
  userId: string,
  pageId: string
): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { plan: true },
  });
  const limit = PLAN_LIMITS[user.plan].maxLinksPerPage;
  if (limit === Infinity) return;

  const count = await prisma.link.count({ where: { pageId } });
  if (count >= limit) {
    throw new PlanLimitError(
      `Limite do plano gratuito atingido: máximo de ${limit} links por página.`
    );
  }
}

export class PlanLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanLimitError";
  }
}
