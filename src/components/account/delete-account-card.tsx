"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteAccount } from "@/actions/user/delete-account";
import { signOut } from "@/lib/auth/auth-client";

const CONFIRM_WORD = "EXCLUIR";

type DeleteAccountCardProps = {
  isPro: boolean;
};

export function DeleteAccountCard({ isPro }: DeleteAccountCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleDelete() {
    setServerError(null);
    setIsDeleting(true);

    try {
      const result = await deleteAccount();
      if (!result.success) {
        setServerError(result.error);
        return;
      }

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
          },
        },
      });
    } finally {
      setIsDeleting(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setConfirmText("");
      setServerError(null);
    }
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Zona de perigo</CardTitle>
        <CardDescription>
          Ações irreversíveis. Prossiga com cuidado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPro && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            <p className="font-medium">Você possui um plano PRO ativo.</p>
            <p className="mt-0.5 text-xs opacity-80">
              Cancele sua assinatura antes de excluir a conta.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Excluir conta</p>
          <p className="text-sm text-muted-foreground">
            Remove permanentemente sua conta e todos os dados associados —
            páginas, links e configurações. Esta ação não pode ser desfeita.
          </p>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={isPro}>
              Excluir minha conta
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Excluir conta permanentemente?</DialogTitle>
              <DialogDescription className="space-y-2 pt-1">
                <span className="block">
                  Todos os seus dados serão removidos e{" "}
                  <strong>não poderão ser recuperados</strong>: páginas, links,
                  configurações e histórico.
                </span>
                <span className="block">
                  Para confirmar, digite{" "}
                  <strong className="font-mono">{CONFIRM_WORD}</strong> abaixo.
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_WORD}
                autoComplete="off"
                spellCheck={false}
              />
              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                disabled={confirmText !== CONFIRM_WORD || isDeleting}
                onClick={handleDelete}
              >
                {isDeleting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Excluir permanentemente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
