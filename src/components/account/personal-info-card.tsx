"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, LockIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateProfile } from "@/actions/user/update-profile";
import { currentUserQueryKey } from "@/queries/use-current-user-query";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/schemas/profile";
import type { CurrentUser } from "@/actions/user/get-current-user";

type PersonalInfoCardProps = {
  currentUser: CurrentUser | null | undefined;
};

export function PersonalInfoCard({ currentUser }: PersonalInfoCardProps) {
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

  async function handleSave(values: UpdateProfileInput) {
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
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <FormField>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" autoComplete="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </FormField>

          <FormField>
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
          </FormField>

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
