"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/auth-client";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/schemas/auth";
import { PasswordInput } from "../password-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const invalidToken = searchParams.get("error") === "INVALID_TOKEN";
  const token =
    tokenParam && !invalidToken ? tokenParam : null;

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-destructive">
          Link inválido ou expirado. Solicite um novo link de recuperação.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/forgot-password">Solicitar novo link</Link>
        </Button>
      </div>
    );
  }

  const resetToken = token;

  async function onSubmit(values: ResetPasswordInput) {
    setServerError(null);

    const { error } = await resetPassword({
      newPassword: values.password,
      token: resetToken,
    });

    if (error) {
      setServerError(error.message ?? "Não foi possível redefinir a senha.");
      return;
    }

    router.push("/sign-in?reset=success");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PasswordInput
        id="password"
        label="Nova senha"
        autoComplete="new-password"
        {...register("password")}
        error={errors.password?.message}
      />
      <PasswordInput
        id="confirmPassword"
        label="Confirmar nova senha"
        autoComplete="new-password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      {serverError ? (
        <p className="text-sm text-destructive">{serverError}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Redefinir senha"
        )}
      </Button>
    </form>
  );
}
