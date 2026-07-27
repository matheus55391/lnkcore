import "server-only";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export { PLAN_LIMITS };

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
      `Limite do plano atingido: máximo de ${limit} links por página.`
    );
  }
}

export class PlanLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanLimitError";
  }
}
