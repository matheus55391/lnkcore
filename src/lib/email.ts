import "server-only";

import * as nodemailer from "nodemailer";
import { sendDiscordLog } from "./discord-log";

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

async function sendViaResend({ to, subject, text, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const from = process.env.RESEND_FROM ?? process.env.SMTP_FROM ?? "makebio <no-reply@makebio.local>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html: html ?? text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      const error = `Resend error ${response.status}: ${body}`;
      console.error("[email]", error);
      await sendDiscordLog("❌ Email não enviado (Resend)", `Assunto: ${subject}\nErro: ${error}`);
      throw new Error(error);
    }

    const data = await response.json() as { id?: string };
    console.log("[email] Resend sent successfully:", data.id);
    await sendDiscordLog("✅ Email enviado via Resend", `Assunto: ${subject}\nPara: ${to}\nID: ${data.id}`);
    return response;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[email] Resend send failed:", errorMsg);
    await sendDiscordLog("❌ Falha ao enviar email (Resend)", `Assunto: ${subject}\nErro: ${errorMsg}`);
    throw error;
  }
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: user ? { user, pass: pass ?? "" } : undefined,
  });
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  try {
    if (process.env.RESEND_API_KEY) {
      console.log("[email] Sending via Resend to:", to);
      await sendViaResend({ to, subject, text, html });
    } else {
      const transporter = getTransporter();
      if (!transporter) {
        const msg = `[email] SMTP_HOST não configurado — email não enviado: ${subject}`;
        console.warn(msg);
        await sendDiscordLog("⚠️ Email não configurado (SMTP)", `Assunto: ${subject}\nMotivo: SMTP_HOST ausente`);
        return;
      }

      const from = process.env.SMTP_FROM ?? "makebio <no-reply@makebio.local>";
      console.log("[email] Sending via SMTP to:", to);

      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html: html ?? text,
      });
      await sendDiscordLog("✅ Email enviado via SMTP", `Assunto: ${subject}\nPara: ${to}`);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[email] Send failed:", errorMsg);
    // Error was already logged to Discord in sendViaResend if using Resend
    if (!process.env.RESEND_API_KEY) {
      await sendDiscordLog("❌ Falha ao enviar email (SMTP)", `Assunto: ${subject}\nErro: ${errorMsg}`);
    }
    throw error;
  }
}

export function buildPasswordResetEmail(url: string) {
  const subject = "Redefinir sua senha — makebio";
  const text = [
    "Recebemos um pedido para redefinir a senha da sua conta makebio.",
    "",
    "Clique no link abaixo para criar uma nova senha:",
    url,
    "",
    "Se você não solicitou isso, ignore este email.",
    "O link expira em 1 hora.",
  ].join("\n");

  const html = `
    <p>Recebemos um pedido para redefinir a senha da sua conta <strong>makebio</strong>.</p>
    <p><a href="${url}">Redefinir senha</a></p>
    <p>Se você não solicitou isso, ignore este email. O link expira em 1 hora.</p>
  `.trim();

  return { subject, text, html };
}
