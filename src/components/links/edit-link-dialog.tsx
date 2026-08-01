"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUpdateLinkMutation } from "@/queries/use-update-link-mutation";
import { updateLinkSchema, type UpdateLinkInput } from "@/schemas/links";
import type { Link } from "@/@types/link";
import { LinkAdornmentField } from "./link-adornment-field";

type Props = { link: Link; pageId: string };

export function EditLinkDialog({ link, pageId }: Props) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateLinkInput>({
    resolver: zodResolver(updateLinkSchema),
    defaultValues: {
      id: link.id,
      title: link.title,
      url: link.url,
      image: link.image,
      emoji: link.emoji,
      type: "CLASSIC",
    },
  });

  const emoji = watch("emoji") ?? null;
  const image = watch("image") ?? null;

  const mutation = useUpdateLinkMutation({
    pageId,
    onSuccess: () => setOpen(false),
    onError: (err) => setServerError(err.message),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setServerError(null);
      reset({
        id: link.id,
        title: link.title,
        url: link.url,
        image: link.image,
        emoji: link.emoji,
        type: "CLASSIC",
      });
    } else {
      reset({
        id: link.id,
        title: link.title,
        url: link.url,
        image: link.image,
        emoji: link.emoji,
        type: "CLASSIC",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Editar link">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar link</DialogTitle>
          <DialogDescription>
            Atualize o título, a URL ou o ícone (emoji ou imagem).
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            setServerError(null);
            mutation.mutate({
              ...values,
              type: "CLASSIC",
              image: values.image ?? null,
              emoji: values.image ? null : (values.emoji ?? null),
            });
          })}
          className="space-y-4"
        >
          <input type="hidden" {...register("id")} />

          <FormField>
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              placeholder="Ex.: Meu portfólio"
              {...register("title")}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              placeholder="https://exemplo.com"
              {...register("url")}
              aria-invalid={errors.url ? "true" : "false"}
            />
            {errors.url && (
              <p className="text-destructive text-sm">{errors.url.message}</p>
            )}
          </FormField>

          <LinkAdornmentField
            key={open ? link.id : "closed"}
            emoji={emoji}
            image={image}
            entityId={link.id}
            disabled={mutation.isPending}
            onChange={({ emoji: nextEmoji, image: nextImage }) => {
              setValue("emoji", nextEmoji, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("image", nextImage, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          />

          {serverError && (
            <p className="text-destructive text-sm">{serverError}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
