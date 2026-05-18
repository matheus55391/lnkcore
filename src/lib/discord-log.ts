export async function sendDiscordLog(
    title?: string,
    message?: string,
    type: "log" | "error" = "log"
) {
    try {
        console.log("WEBHOOK:", process.env.DISCORD_WEBHOOK_URL);

        await fetch(process.env.DISCORD_WEBHOOK_URL!, {
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
    } catch (error) {
        console.error("Erro ao enviar log:", error);
    }
}

export async function sendDiscordError(
    title: string,
    message: string
) {
    try {
        await fetch(process.env.DISCORD_WEBHOOK_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                embeds: [
                    {
                        title,
                        description: message,
                        color: 16711680,
                        timestamp: new Date().toISOString(),
                    },
                ],
            }),
        });
    } catch (error) {
        console.error("Erro ao enviar erro:", error);
    }
}