"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CopyIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updatePage } from "@/actions/pages/update-page";
import type { Page } from "@/@types";
import { pageQueryKey } from "@/queries/use-page-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/image-upload";

const TITLE_MAX = 80;
const BIO_MAX = 280;

const profileSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(TITLE_MAX),
  bio: z.string().max(BIO_MAX),
});

type ProfileForm = z.infer<typeof profileSchema>;

type Props = {
  page: Pick<Page, "id" | "title" | "bio" | "image" | "slug" | "layout">;
};

export function ProfilePanel({ page }: Props) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: page.title,
      bio: page.bio ?? "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    reset({
      title: page.title,
      bio: page.bio ?? "",
    });
  }, [page.title, page.bio, reset]);

  const mutation = useMutation({
    mutationFn: updatePage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: pageQueryKey(page.id),
      });
      toast.success("Cabeçalho atualizado.");
    },
    onError: () => {
      toast.error("Não foi possível atualizar o cabeçalho.");
    },
  });

  function handleSubmit(data: ProfileForm) {
    mutation.mutate({
      id: page.id,
      title: data.title.trim(),
      bio: data.bio.trim(),
    });
  }

  async function handleCopySlug() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${page.slug}`
      );
      setCopied(true);
      toast.success("Link copiado");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  }

  const title = form.watch("title");
  const bio = form.watch("bio");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Cabeçalho</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {page.layout === "COVER"
            ? "Capa, nome e bio que aparecem no topo da página pública."
            : "Foto, nome e bio que aparecem no topo da página pública."}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 py-2">
        <ImageUpload
          pageId={page.id}
          initialImage={page.image}
          size={96}
          shape={page.layout === "COVER" ? "banner" : "circle"}
        />
        <p className="text-xs text-muted-foreground">
          {page.layout === "COVER"
            ? "Clique para trocar a capa"
            : "Clique para trocar a foto"}
        </p>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField>
          <Label htmlFor="editor-title">Título</Label>
          <Input
            id="editor-title"
            maxLength={TITLE_MAX}
            placeholder="Seu nome ou marca"
            {...form.register("title")}
          />
          {form.formState.errors.title ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          ) : null}
          <p className="text-right text-xs text-muted-foreground">
            {title?.length ?? 0} / {TITLE_MAX}
          </p>
        </FormField>

        <FormField>
          <Label htmlFor="editor-bio">Bio</Label>
          <textarea
            id="editor-bio"
            rows={4}
            maxLength={BIO_MAX}
            placeholder="Uma frase curta sobre você"
            className="w-full resize-none rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register("bio")}
          />
          {form.formState.errors.bio ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.bio.message}
            </p>
          ) : null}
          <p className="text-right text-xs text-muted-foreground">
            {bio?.length ?? 0} / {BIO_MAX}
          </p>
        </FormField>

        <FormField>
          <Label htmlFor="editor-slug">URL da página</Label>
          <div className="flex items-center gap-2">
            <Input
              id="editor-slug"
              readOnly
              value={`makebio.com.br/${page.slug}`}
              className="bg-muted/40"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Copiar URL"
              onClick={() => {
                void handleCopySlug();
              }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        </FormField>

        <Button
          type="submit"
          disabled={mutation.isPending || !form.formState.isValid}
        >
          {mutation.isPending ? (
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
          ) : null}
          Salvar cabeçalho
        </Button>
      </form>
    </div>
  );
}
