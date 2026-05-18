import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { sendDiscordLog } from "./discord-log";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "https://www.makebio.com.br",
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },

  databaseHooks: {
    user: {
      create: {
        after: async () => {
          await sendDiscordLog(
            "Nova conta criada",
            `Horário: ${new Date().toLocaleString("pt-BR")}`
          );
        },
      },
    },
  },

  socialProviders: {},

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,

    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  advanced: {
    cookies: {
      session_token: {
        attributes: {
          httpOnly: true,
          sameSite: "lax",
          secure:
            process.env.BETTER_AUTH_URL?.startsWith("https://") ?? false,
          path: "/",
        },
      },
    },
  },

  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;