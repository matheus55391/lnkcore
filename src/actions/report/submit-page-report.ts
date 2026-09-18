"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { sendDiscordLog } from "@/lib/discord-log";
import { isRateLimited } from "@/lib/rate-limit";
import { isAllowedReportPageUrl } from "@/lib/report-page-url";
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

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

export async function submitPageReport(
  input: ReportPageInput
): Promise<ActionResult> {
  const ip = await clientIp();
  if (isRateLimited(`report-action:${ip}`, 5, 60_000)) {
    return {
      success: false,
      error: "Muitas denúncias. Aguarde um minuto e tente novamente.",
    };
  }

  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { pageUrl, reason, details, email } = parsed.data;

  if (!isAllowedReportPageUrl(pageUrl)) {
    return {
      success: false,
      error: "Informe uma URL válida de makebio.com.br.",
    };
  }

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

  const discordOk = await sendDiscordLog(
    "🚨 Denúncia de página",
    `Página: ${pageUrl}\nMotivo: ${reasonLabel}\nDenunciante: ${reporter}\nDetalhes: ${detailText}`
  );

  let emailOk = false;
  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY || process.env.SMTP_HOST
  );
  if (emailConfigured) {
    try {
      await sendEmail({ to, subject, text });
      emailOk = true;
    } catch (err) {
      console.error("[report] email failed", err);
    }
  }

  if (!discordOk && !emailOk) {
    return {
      success: false,
      error: "Não foi possível enviar a denúncia. Tente novamente mais tarde.",
    };
  }

  return { success: true };
}
