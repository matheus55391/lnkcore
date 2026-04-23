"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useCurrentUser } from "@/queries/use-current-user-query";
import { useCreateCheckoutSessionMutation } from "@/queries/use-create-checkout-session-mutation";

export function UpgradeButton() {
  const [error, setError] = useState<string | null>(null);
  const { data: currentUser, isLoading } = useCurrentUser();

  const mutation = useCreateCheckoutSessionMutation({
    onError: (err) => setError(err.message),
  });

  if (isLoading) {
    return <div className="h-6 w-12 rounded-full bg-muted" aria-hidden="true" />;
  }

  if (currentUser?.plan === "PRO") {
    return (
      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground/80">
        PRO
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        title="Acessar para pagar"
        aria-label="Acessar para pagar"
        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground/80 hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => {
          setError(null);
          mutation.mutate();
        }}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
        ) : null}
        FREE
      </button>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
