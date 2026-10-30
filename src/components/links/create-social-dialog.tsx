"use client";

import { useState } from "react";
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react";

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
import {
  SELECTABLE_SOCIALS,
  getSelectableSocial,
  type SelectableSocial,
} from "@/lib/social-platforms";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";
import { cn } from "@/lib/utils";

type Props = {
  pageId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  initialPlatformId?: SelectableSocial["id"] | null;
};

export function CreateSocialDialog({
  pageId,
  open: openProp,
  onOpenChange,
  showTrigger = true,
  initialPlatformId = null,
}: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const [serverError, setServerError] = useState<string | null>(null);
  const [picked, setPicked] = useState<SelectableSocial | null | undefined>(
    undefined
  );
  const [profile, setProfile] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const selected =
    picked !== undefined
      ? picked
      : open && initialPlatformId
        ? (getSelectableSocial(initialPlatformId) ?? null)
        : null;

  const mutation = useCreateLinkMutation({
    pageId,
    onSuccess: () => {
      resetState();
      setOpen(false);
    },
    onError: (err) => setServerError(err.message),
  });

  function resetState() {
    setServerError(null);
    setFieldError(null);
    setPicked(undefined);
    setProfile("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetState();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    const value = profile.trim();
    if (!value) {
      setFieldError("Informe o usuário ou a URL do perfil.");
      return;
    }

    const url = selected.buildUrl(value);
    try {
      new URL(url);
    } catch {
      setFieldError("URL inválida.");
      return;
    }

    setFieldError(null);
    setServerError(null);
    mutation.mutate({
      pageId,
      url,
      title: selected.label,
      type: "SOCIAL",
      image: null,
      emoji: null,
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova rede
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selected ? `Adicionar ${selected.label}` : "Adicionar rede social"}
          </DialogTitle>
          <DialogDescription>
            {selected
              ? `Conecte seu perfil do ${selected.label}.`
              : "Escolha a rede. Ela aparece só como ícone na página."}
          </DialogDescription>
        </DialogHeader>

        {!selected ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {SELECTABLE_SOCIALS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => setPicked(platform)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-center transition-colors hover:bg-accent"
                )}
              >
                <span className="bg-muted flex size-10 items-center justify-center rounded-full">
                  <SocialPlatformIcon
                    platformId={platform.id}
                    className="size-5"
                  />
                </span>
                <span className="text-xs font-medium leading-tight">
                  {platform.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              className="text-muted-foreground inline-flex items-center gap-1 text-xs hover:underline"
              onClick={() => {
                setPicked(null);
                setProfile("");
                setFieldError(null);
                setServerError(null);
              }}
            >
              <ArrowLeftIcon className="size-3.5" />
              Voltar às redes
            </button>

            <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
              <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                <SocialPlatformIcon
                  platformId={selected.id}
                  className="size-5"
                />
              </span>
              <div className="min-w-0">
                <p className="font-medium leading-tight">{selected.label}</p>
                <p className="text-muted-foreground truncate text-xs">
                  Ícone na página pública
                </p>
              </div>
            </div>

            <FormField>
              <Label htmlFor="social-profile">Usuário ou URL</Label>
              <Input
                id="social-profile"
                placeholder={selected.placeholder}
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                autoFocus
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
                  "Adicionar"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
