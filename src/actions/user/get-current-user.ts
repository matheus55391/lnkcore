"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import type { ActionResult } from "@/@types/action-result";
import type { Plan } from "@/generated/prisma";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  plan: Plan;
};

export async function getCurrentUser(): Promise<ActionResult<CurrentUser>> {
  const session = await requireSession();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, plan: true },
  });

  return { success: true, data: user };
}
