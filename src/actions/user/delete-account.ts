"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import type { ActionResult } from "@/@types/action-result";

export async function deleteAccount(): Promise<ActionResult> {
  const session = await requireSession();
  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeSubscriptionId: true },
  });

  if (!user) {
    return { success: false, error: "Usuário não encontrado." };
  }

  if (user.stripeSubscriptionId) {
    return {
      success: false,
      error:
        "Você possui um plano PRO ativo. Cancele sua assinatura antes de excluir a conta.",
    };
  }

  await prisma.user.delete({ where: { id: userId } });

  return { success: true };
}
