"use client";

import { useState } from "react";
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
import type { Link } from "@/@types/link";
import {
  detectSocialPlatform,
  getSelectableSocial,
  platformLabelFromUrl,
} from "@/lib/social-platforms";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";

type Props = { link: Link; pageId: string };

export function EditSocialDialog({ link, pageId }: Props) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [profile, setProfile] = useState(link.url);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const platform = detectSocialPlatform(link.url);
  const selectable = getSelectableSocial(platform.id);

  const mutation = useUpdateLinkMutation({
    pageId,
    onSuccess: () => setOpen(false),
    onError: (err) => setServerError(err.message),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setServerError(null);
      setFieldError(null);
      setProfile(link.url);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = profile.trim();
    if (!value) {
      setFieldError("Informe o usuário ou a URL do perfil.");
      return;
    }

    const url = selectable ? selectable.buildUrl(value) : value;
    try {
      new URL(url);
    } catch {
      setFieldError("URL inválida.");
      return;
    }

    setFieldError(null);
    setServerError(null);
    mutation.mutate({
      id: link.id,
      url,
      title: selectable?.label ?? platformLabelFromUrl(url) ?? link.title,
      type: "SOCIAL",
      image: null,
      emoji: null,
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Editar rede social">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar {platform.label}</DialogTitle>
          <DialogDescription>
            Atualize o perfil do {platform.label}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
            <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
              <SocialPlatformIcon
                platformId={platform.id}
                className="size-5"
              />
            </span>
            <p className="font-medium">{platform.label}</p>
          </div>

          <FormField>
            <Label htmlFor="edit-social-profile">Usuário ou URL</Label>
            <Input
              id="edit-social-profile"
              placeholder={selectable?.placeholder ?? "https://..."}
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
            />
            {fieldError && (
              <p className="text-destructive text-sm">{fieldError}</p>
            )}
          </FormField>

          {serverError && (
            <p className="text-destructive text-sm break-words">{serverError}</p>
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
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
