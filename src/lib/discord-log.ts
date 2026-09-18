export async function sendDiscordLog(
  title?: string,
  message?: string,
  type: "log" | "error" = "log"
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
        embeds: [
          {
            title: String(title ?? "Log"),
            description: String(message ?? "Sem descrição"),
            color: type === "error" ? 16711680 : 5763719,
            timestamp: new Date().toISOString(),
          },
        ],
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
  message: string
): Promise<boolean> {
  return sendDiscordLog(title, message, "error");
}
