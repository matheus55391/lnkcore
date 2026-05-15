"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireSession } from "@/utils/session";
import type { ActionResult } from "@/@types/action-result";

export async function updateProfile(name: string): Promise<ActionResult> {
  await requireSession();

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { name },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Não foi possível atualizar o perfil." };
  }
}
