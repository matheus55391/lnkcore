"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon } from "lucide-react";

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

import { useCreateLinkMutation } from "@/queries/use-create-link-mutation";
import { createLinkSchema, type CreateLinkInput } from "@/schemas/links";
import { LinkAdornmentField } from "./link-adornment-field";
import {
  LinkStylePicker,
  resolveClassicStyle,
} from "./link-style-picker";

type Props = {
  pageId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
};

export function CreateLinkDialog({
  pageId,
  open: openProp,
  onOpenChange,
  showTrigger = true,
}: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadEntityId, setUploadEntityId] = useState(() =>
    crypto.randomUUID()
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      pageId,
      title: "",
      url: "",
      image: null,
      emoji: null,
      type: "CLASSIC",
    },
  });

  const emoji = watch("emoji") ?? null;
  const image = watch("image") ?? null;
  const style = resolveClassicStyle(watch("type"));

  const mutation = useCreateLinkMutation({
    pageId,
    onSuccess: () => {
      reset({
        pageId,
        title: "",
        url: "",
        image: null,
        emoji: null,
        type: "CLASSIC",
      });
      setUploadEntityId(crypto.randomUUID());
      setOpen(false);
    },
    onError: (err) => setServerError(err.message),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setServerError(null);
      reset({
        pageId,
        title: "",
        url: "",
        image: null,
        emoji: null,
        type: "CLASSIC",
      });
      setUploadEntityId(crypto.randomUUID());
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo link
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar link</DialogTitle>
          <DialogDescription>
            Escolha o estilo, informe o título, a URL e, se quiser, uma imagem.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            setServerError(null);
            mutation.mutate({
              ...values,
              type: resolveClassicStyle(values.type),
              image: values.image ?? null,
              emoji: values.image ? null : (values.emoji ?? null),
            });
          })}
          className="space-y-4"
        >
          <input type="hidden" {...register("pageId")} />

          <LinkStylePicker
            value={style}
            disabled={mutation.isPending}
            onChange={(next) =>
              setValue("type", next, { shouldDirty: true, shouldTouch: true })
            }
          />

          <FormField>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex.: Meu portfólio"
              {...register("title")}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://exemplo.com"
              {...register("url")}
              aria-invalid={errors.url ? "true" : "false"}
            />
            {errors.url && (
              <p className="text-destructive text-sm">{errors.url.message}</p>
            )}
          </FormField>

          <LinkAdornmentField
            key={uploadEntityId}
            emoji={emoji}
            image={image}
            entityId={uploadEntityId}
            layout={style === "FEATURED" ? "cover" : "row"}
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
                "Adicionar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
