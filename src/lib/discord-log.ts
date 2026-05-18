export async function sendDiscordLog(
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
                        color: 5763719,
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