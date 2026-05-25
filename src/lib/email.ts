import "server-only";

import nodemailer from "nodemailer";
import { sendDiscordLog } from "./discord-log";

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

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
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] SMTP_HOST não configurado — email não enviado:", subject);
    return;
  }

  const from = process.env.SMTP_FROM ?? "makebio <no-reply@makebio.local>";

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: html ?? text,
  });
  await sendDiscordLog("Email enviado", `Assunto: ${subject}`);
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
