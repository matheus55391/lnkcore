"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { updatePage } from "@/actions/pages/update-page";
import type { Page } from "@/@types";
import { pageQueryKey } from "@/queries/use-page-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TITLE_MAX = 80;
const BIO_MAX = 280;

type Props = {
  page: Pick<Page, "id" | "title" | "bio">;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const editPageSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(TITLE_MAX),
  bio: z.string().max(BIO_MAX),
});

type EditPageInfoForm = z.infer<typeof editPageSchema>;

export function EditPageInfoDialog({
  page,
  isOpen,
  setOpen,
}: Props) {
  const queryClient = useQueryClient();

  const form = useForm<EditPageInfoForm>({
    resolver: zodResolver(editPageSchema),
    defaultValues: {
      title: page.title,
      bio: page.bio ?? "",
    },
  });

  function handleOpenChange(open: boolean) {
    setOpen(open);

    if (open) {
      form.reset({
        title: page.title,
        bio: page.bio ?? "",
      });
    }
  }

  const editPageMutation = useMutation({
    mutationFn: updatePage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: pageQueryKey(page.id),
      });

      toast.success(
        "Informações da página atualizadas com sucesso.",
      );

      setOpen(false);
    },
    onError: () => {
      toast.error(
        "Ocorreu um erro ao atualizar as informações da página.",
      );
    },
  });

  function onSubmit(data: EditPageInfoForm) {
    editPageMutation.mutate({
      id: page.id,
      title: data.title.trim(),
      bio: data.bio.trim(),
    });
  }

  const title = form.watch("title");
  const bio = form.watch("bio");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Título e bio</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4 pt-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-1.5">
            <Label htmlFor="page-title">
              Título
            </Label>

            <Input
              id="page-title"
              maxLength={TITLE_MAX}
              placeholder="Seu nome ou marca"
              {...form.register("title")}
            />

            {form.formState.errors.title && (
              <p className="text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}

            <p className="text-right text-xs text-muted-foreground">
              {title?.length ?? 0} / {TITLE_MAX}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="page-bio">
              Bio
            </Label>

            <textarea
              id="page-bio"
              rows={4}
              maxLength={BIO_MAX}
              placeholder="Conte um pouco sobre você..."
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("bio")}
            />

            {form.formState.errors.bio && (
              <p className="text-xs text-destructive">
                {form.formState.errors.bio.message}
              </p>
            )}

            <p className="text-right text-xs text-muted-foreground">
              {bio?.length ?? 0} / {BIO_MAX}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              editPageMutation.isPending ||
              !form.formState.isValid
            }
          >
            {editPageMutation.isPending && (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            )}

            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}