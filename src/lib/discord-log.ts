const SITE_ORIGIN =
  process.env.BETTER_AUTH_URL?.replace(/\/$/, "") ??
  "https://www.makebio.com.br";

export type DiscordKind = "info" | "success" | "warn" | "error";

export type DiscordField = {
  name: string;
  value: string;
  inline?: boolean;
};

export type DiscordLogPayload = {
  title: string;
  description?: string;
  kind?: DiscordKind;
  fields?: DiscordField[];
  url?: string;
  footer?: string;
};

const KIND_COLOR: Record<DiscordKind, number> = {
  info: 0x5865f2,
  success: 0x57f287,
  warn: 0xfee75c,
  error: 0xed4245,
};

function clip(value: string, max: number): string {
  const trimmed = value.trim() || "—";
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function publicPageUrl(slug: string): string {
  return `${SITE_ORIGIN}/${slug.replace(/^\//, "")}`;
}

export function buildDiscordEmbed(payload: DiscordLogPayload) {
  const kind = payload.kind ?? "info";
  const fields = (payload.fields ?? [])
    .filter((field) => field.name && field.value)
    .slice(0, 25)
    .map((field) => ({
      name: clip(field.name, 256),
      value: clip(field.value, 1024),
      inline: field.inline ?? false,
    }));

  return {
    title: clip(payload.title, 256),
    description: payload.description
      ? clip(payload.description, 4096)
      : undefined,
    url: payload.url,
    color: KIND_COLOR[kind],
    fields: fields.length > 0 ? fields : undefined,
    footer: {
      text: clip(payload.footer ?? "MakeBio", 2048),
    },
    timestamp: new Date().toISOString(),
  };
}

export async function sendDiscordLog(
  payload: DiscordLogPayload
): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[discord] DISCORD_WEBHOOK_URL não configurado.");
    return false;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [buildDiscordEmbed(payload)],
      }),
    });
    if (!res.ok) {
      console.error("[discord] webhook failed:", res.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erro ao enviar log:", error);
    return false;
  }
}

export async function sendDiscordError(
  title: string,
  description: string,
  fields?: DiscordField[]
): Promise<boolean> {
  return sendDiscordLog({
    title,
    description,
    fields,
    kind: "error",
  });
}
