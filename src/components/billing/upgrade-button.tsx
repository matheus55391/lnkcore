"use client";

import { useState } from "react";
import { SparklesIcon, Loader2Icon, BadgeCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/queries/use-current-user-query";
import { useCreateCheckoutSessionMutation } from "@/queries/use-create-checkout-session-mutation";

export function UpgradeButton() {
  const [error, setError] = useState<string | null>(null);
  const { data: currentUser, isLoading } = useCurrentUser();

  const mutation = useCreateCheckoutSessionMutation({
    onError: (err) => setError(err.message),
  });

  if (isLoading) {
    return (
      <div className="h-8 w-24" aria-hidden="true" />
    );
  }

  if (currentUser?.plan === "PRO") {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
        <BadgeCheckIcon className="h-4 w-4" />
        PRO
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          setError(null);
          mutation.mutate();
        }}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <Loader2Icon className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <SparklesIcon className="mr-2 h-4 w-4" />
            Upgrade PRO
          </>
        )}
      </Button>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
