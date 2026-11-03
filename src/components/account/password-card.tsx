"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/auth/password-input";
import { changePassword } from "@/actions/user/change-password";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/schemas/profile";

export function PasswordCard() {
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

  async function handleChangePassword(values: ChangePasswordInput) {
    setServerError(null);
    setSuccess(false);

    const result = await changePassword(
      values.currentPassword,
      values.newPassword,
    );
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
        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-4"
        >
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
