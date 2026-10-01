"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { GoogleIcon } from "./google-icon";

type Props = {
  callbackURL?: string;
  label?: string;
};

export function GoogleSignInButton({
  callbackURL = "/dashboard",
  label = "Entrar com Google",
}: Props) {
  const [pending, setPending] = useState(false);
  const enabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED);

  if (!enabled) return null;

  async function handleClick() {
    setPending(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL,
      });
      if (error) {
        const msg = error.message ?? "Não foi possível entrar com Google.";
        toast.error(
          /database|prisma|P1000|authentication failed/i.test(msg)
            ? "Falha ao conectar no banco. Confira o DATABASE_URL / Postgres."
            : msg
        );
        setPending(false);
      }
      // success redirects the browser — leave pending until navigation
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg && msg !== "Failed to fetch"
          ? msg
          : "Não foi possível entrar com Google. Tente de novo."
      );
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="auth-btn-outline w-full"
      disabled={pending}
      onClick={() => {
        void handleClick();
      }}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      {label}
    </Button>
  );
}

export function AuthDivider({ label = "ou com e-mail" }: { label?: string }) {
  const enabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED);
  if (!enabled) return null;

  return (
    <div className="auth-divider flex items-center gap-3 text-xs">
      <span className="auth-divider-line h-px flex-1" />
      {label}
      <span className="auth-divider-line h-px flex-1" />
    </div>
  );
}
