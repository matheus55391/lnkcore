"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCancelSubscriptionMutation } from "@/queries/use-cancel-subscription-mutation";

export function CancelSubscriptionDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useCancelSubscriptionMutation({
    onSuccess: () => setOpen(false),
    onError: (err) => setServerError(err.message),
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setServerError(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          Cancelar renovação automática
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancelar renovação automática?</DialogTitle>
          <DialogDescription>
            Você continuará com acesso PRO até o fim do período atual. Após essa
            data, o plano voltará automaticamente para FREE. Nenhum reembolso
            será emitido.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Manter assinatura
          </Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirmar cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
