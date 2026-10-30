"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/utils/session";
import { assertCanCreatePage, PlanLimitError } from "@/lib/plan";
import { createPageSchema, type CreatePageInput } from "@/schemas/pages";
import { publicPageUrl, sendDiscordLog } from "@/lib/discord-log";
import type { ActionResult } from "@/@types/action-result";
import type { Page } from "@/@types";

export async function createPage(
  input: CreatePageInput
): Promise<ActionResult<Page>> {
  const parsed = createPageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await requireSession();
  const { slug } = parsed.data;

  try {
    await assertCanCreatePage(session.user.id);

    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Este slug já está em uso." };
    }

    const page = await prisma.page.create({
      data: { slug, title: slug, userId: session.user.id },
    });

    const pageUrl = publicPageUrl(page.slug);
    await sendDiscordLog({
      title: "Nova página criada",
      description: "Um perfil novo entrou no ar.",
      kind: "success",
      url: pageUrl,
      fields: [
        {
          name: "Página",
          value: `[${pageUrl.replace(/^https:\/\//, "")}](${pageUrl})`,
        },
        {
          name: "Usuário",
          value: session.user.name || "—",
          inline: true,
        },
        {
          name: "Email",
          value: session.user.email || "—",
          inline: true,
        },
      ],
      footer: `id ${session.user.id}`,
    });

    return { success: true, data: page };
  } catch (err) {
    if (err instanceof PlanLimitError) {
      return { success: false, error: err.message };
    }
    throw err;
  }
}
