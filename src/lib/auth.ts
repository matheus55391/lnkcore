import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { buildPasswordResetEmail, sendEmail } from "./email";
import { sendDiscordLog } from "./discord-log";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "https://www.makebio.com.br",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      const { subject, text, html } = buildPasswordResetEmail(url);
      void sendEmail({
        to: user.email,
        subject,
        text,
        html,
      });
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendDiscordLog({
            title: "Nova conta criada",
            description: "Alguém acabou de entrar no MakeBio.",
            kind: "success",
            fields: [
              { name: "Nome", value: user.name || "—", inline: true },
              { name: "Email", value: user.email || "—", inline: true },
            ],
            footer: `id ${user.id}`,
          });
        },
      },
    },
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

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