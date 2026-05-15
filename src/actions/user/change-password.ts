"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireSession } from "@/utils/session";
import type { ActionResult } from "@/@types/action-result";

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  await requireSession();

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword, newPassword, revokeOtherSessions: false },
    });
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "";
    if (message.includes("Invalid password")) {
      return { success: false, error: "Senha atual incorreta." };
    }
    return { success: false, error: "Não foi possível alterar a senha." };
  }
}
