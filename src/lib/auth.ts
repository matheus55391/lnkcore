import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  // Social providers ready to plug in later (GitHub/Google...) when configured.
  socialProviders: {},
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh cookie every 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    cookies: {
      session_token: {
        attributes: {
          httpOnly: true,
          sameSite: "lax",
          // Secure só deve ser true quando servindo via HTTPS.
          // Usar NODE_ENV=production quebra testes locais via HTTP (Docker local).
          secure: process.env.BETTER_AUTH_URL?.startsWith("https://") ?? false,
          path: "/",
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
