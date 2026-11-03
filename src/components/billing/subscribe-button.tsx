"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateCheckoutSessionMutation } from "@/queries/use-create-checkout-session-mutation";

export function SubscribeButton() {
  const [error, setError] = useState<string | null>(null);
  const mutation = useCreateCheckoutSessionMutation({
    onError: (err) => setError(err.message),
  });

  return (
    <div className="space-y-2">
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending && (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        )}
        Assinar agora
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
