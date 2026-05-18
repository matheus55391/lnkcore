"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPageSchema, type CreatePageInput } from "@/schemas/pages";
import { useCreatePageMutation } from "@/queries/use-create-page-mutation";

export function CreatePageDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePageInput>({
    resolver: zodResolver(createPageSchema),
    defaultValues: { slug: "" },
  });

  const mutation = useCreatePageMutation({
    onSuccess: () => {
      reset();
      setOpen(false);
    },
    onError: (err) => setServerError(err.message),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setServerError(null);
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nova página
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar nova página</DialogTitle>
          <DialogDescription>
            Escolha um slug único para a sua página. Ele será usado como URL e
            título inicial.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            setServerError(null);
            mutation.mutate(values);
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-sm shrink-0">
                makebio.app/
              </span>
              <Input
                id="slug"
                placeholder="meu-perfil"
                autoComplete="off"
                autoFocus
                aria-invalid={errors.slug ? "true" : "false"}
                {...register("slug")}
              />
            </div>
            {errors.slug ? (
              <p className="text-destructive text-sm">{errors.slug.message}</p>
            ) : serverError ? (
              <p className="text-destructive text-sm">{serverError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Criar página"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
