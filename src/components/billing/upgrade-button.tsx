"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SparklesIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/actions/stripe/create-checkout-session";

export function UpgradeButton() {
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await createCheckoutSession();
      if (!res.success) throw new Error(res.error);
      window.location.href = res.data.url;
    },
    onError: (err: Error) => setError(err.message),
  });

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
