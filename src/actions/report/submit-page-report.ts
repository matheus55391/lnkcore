"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { sendDiscordLog } from "@/lib/discord-log";
import type { ActionResult } from "@/@types/action-result";

const reportSchema = z.object({
  pageUrl: z.string().url("URL da página inválida").max(500),
  reason: z.enum([
    "spam",
    "conteudo-ilegal",
    "assedio",
    "improprio",
    "propriedade-intelectual",
    "outro",
  ]),
  details: z.string().max(2000).optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
});

export type ReportPageInput = z.infer<typeof reportSchema>;

const REASON_LABELS: Record<ReportPageInput["reason"], string> = {
  spam: "Spam ou golpe",
  "conteudo-ilegal": "Conteúdo ilegal",
  assedio: "Assédio ou ódio",
  improprio: "Conteúdo impróprio",
  "propriedade-intelectual": "Violação de propriedade intelectual",
  outro: "Outro",
};

export async function submitPageReport(
  input: ReportPageInput
): Promise<ActionResult> {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { pageUrl, reason, details, email } = parsed.data;
  const reasonLabel = REASON_LABELS[reason];
  const reporter = email?.trim() || "(não informado)";
  const detailText = details?.trim() || "(sem detalhes)";

  const subject = `[MakeBio] Denúncia: ${reasonLabel}`;
  const text = [
    "Nova denúncia de página MakeBio",
    "",
    `Página: ${pageUrl}`,
    `Motivo: ${reasonLabel}`,
    `E-mail do denunciante: ${reporter}`,
    "",
    "Detalhes:",
    detailText,
  ].join("\n");

  const to =
    process.env.ABUSE_EMAIL ??
    process.env.SUPPORT_EMAIL ??
    "matheus.felipe55391@gmail.com";

  try {
    await sendDiscordLog(
      "🚨 Denúncia de página",
      `Página: ${pageUrl}\nMotivo: ${reasonLabel}\nDenunciante: ${reporter}\nDetalhes: ${detailText}`
    );

    await sendEmail({ to, subject, text });

    return { success: true };
  } catch (err) {
    console.error("[report]", err);
    // Discord may have received it even if email failed
    return { success: true };
  }
}
