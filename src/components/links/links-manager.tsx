"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useLinks } from "@/queries/use-links-query";
import { useCreateLinkMutation } from "@/queries/use-create-link-mutation";
import { useDeleteLinkMutation } from "@/queries/use-delete-link-mutation";
import { createLinkSchema, type CreateLinkInput } from "@/schemas/links";

type Props = { pageId: string };

export function LinksManager({ pageId }: Props) {
  const { data: links, isLoading } = useLinks(pageId);
  const deleteMutation = useDeleteLinkMutation({ pageId });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Links</h2>
        <CreateLinkDialog pageId={pageId} />
      </div>

      {!links || links.length === 0 ? (
        <p className="text-muted-foreground text-sm rounded-lg border border-dashed py-10 text-center">
          Nenhum link ainda. Clique em “Novo link” para criar.
        </p>
      ) : (
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between rounded-lg border bg-background px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{link.title}</p>
                <p className="text-muted-foreground text-xs truncate">
                  {link.url}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate(link.id)}
                disabled={deleteMutation.isPending}
                aria-label="Excluir link"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CreateLinkDialog({ pageId }: { pageId: string }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: { pageId, title: "", url: "" },
  });

  const mutation = useCreateLinkMutation({
    pageId,
    onSuccess: () => {
      reset({ pageId, title: "", url: "" });
      setOpen(false);
    },
    onError: (err) => setServerError(err.message),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setServerError(null);
      reset({ pageId, title: "", url: "" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar link</DialogTitle>
          <DialogDescription>
            Informe o título e a URL de destino.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            setServerError(null);
            mutation.mutate(values);
          })}
          className="space-y-4"
        >
          <input type="hidden" {...register("pageId")} />

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Meu site"
              {...register("title")}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://..."
              {...register("url")}
              aria-invalid={errors.url ? "true" : "false"}
            />
            {errors.url && (
              <p className="text-destructive text-sm">{errors.url.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-destructive text-sm">{serverError}</p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
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
