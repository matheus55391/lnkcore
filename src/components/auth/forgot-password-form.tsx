"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { requestPasswordReset } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/schemas/auth";

export function ForgotPasswordForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setServerError(null);
    setServerMessage(null);

    const redirectTo = `${window.location.origin}/reset-password`;

    const { error } = await requestPasswordReset({
      email: values.email,
      redirectTo,
    });

    if (error) {
      setServerError(error.message ?? "Não foi possível enviar o email.");
      return;
    }

    setServerMessage(
      "Se este email estiver cadastrado, você receberá um link para redefinir a senha."
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </FormField>

      {serverError ? (
        <p className="text-sm text-destructive">{serverError}</p>
      ) : null}

      {serverMessage ? (
        <p className="text-sm text-muted-foreground">{serverMessage}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Enviar link"
        )}
      </Button>
    </form>
  );
}
