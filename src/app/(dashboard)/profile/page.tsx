"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeftIcon, Loader2Icon, LockIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { PasswordInput } from "@/components/password-input";
import { useCurrentUser, currentUserQueryKey } from "@/queries/use-current-user-query";
import { updateProfile } from "@/actions/user/update-profile";
import { changePassword } from "@/actions/user/change-password";
import { deleteAccount } from "@/actions/user/delete-account";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "@/schemas/profile";
import { signOut } from "@/lib/auth-client";
import type { CurrentUser } from "@/actions/user/get-current-user";

export default function ProfilePage() {
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
          <Link href="/dashboard">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Conta</h1>
      </div>

      <div className="flex border-b">
        <Link
          href="/profile"
          className="flex-1 text-center px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary"
        >
          Perfil
        </Link>
        <Link
          href="/billing"
          className="flex-1 text-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Assinatura
        </Link>
      </div>

      <PersonalInfoSection currentUser={currentUser} />
      <PasswordSection />
      <DangerZoneSection isPro={currentUser?.plan === "PRO"} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Personal Info
// ---------------------------------------------------------------------------

function PersonalInfoSection({
  currentUser,
}: {
  currentUser: CurrentUser | null | undefined;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: currentUser?.name ?? "" },
  });

  async function onSubmit(values: UpdateProfileInput) {
    setServerError(null);
    setSuccess(false);

    const result = await updateProfile(values.name);
    if (!result.success) {
      setServerError(result.error);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    setSuccess(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações pessoais</CardTitle>
        <CardDescription>Atualize o seu nome de exibição.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" autoComplete="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5">
              Email
              <LockIcon className="h-3 w-3 text-muted-foreground" />
            </Label>
            <Input
              id="email"
              value={currentUser?.email ?? ""}
              disabled
              readOnly
              className="opacity-60"
            />
            <p className="text-xs text-muted-foreground">
              O email não pode ser alterado.
            </p>
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Perfil atualizado com sucesso.
            </p>
          )}

          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Salvar alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Password
// ---------------------------------------------------------------------------

function PasswordSection() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordInput) {
    setServerError(null);
    setSuccess(false);

    const result = await changePassword(values.currentPassword, values.newPassword);
    if (!result.success) {
      setServerError(result.error);
      return;
    }

    setSuccess(true);
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>Altere sua senha de acesso.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            id="currentPassword"
            label="Senha atual"
            autoComplete="current-password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />
          <PasswordInput
            id="newPassword"
            label="Nova senha"
            autoComplete="new-password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirmar nova senha"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Senha alterada com sucesso.
            </p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Alterar senha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Danger Zone
// ---------------------------------------------------------------------------

function DangerZoneSection({ isPro }: { isPro: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const CONFIRM_WORD = "EXCLUIR";

  async function handleDelete() {
    setServerError(null);
    setIsDeleting(true);

    try {
      const result = await deleteAccount();
      if (!result.success) {
        setServerError(result.error);
        return;
      }

      // Conta deletada — limpa cookie e redireciona
      await signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/sign-in"; } } });
    } finally {
      setIsDeleting(false);
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

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setConfirmText("");
              setServerError(null);
            }
          }}
        >
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
