"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

import { updatePage } from "@/actions/pages/update-page";
import { pageQueryKey } from "@/queries/use-page-query";
import type { Page } from "@/@types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TITLE_MAX = 80;
const BIO_MAX = 280;

type Props = {
  page: Pick<Page, "id" | "title" | "bio">;
};

export function EditPageInfoDialog({ page }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(page.title);
  const [bio, setBio] = useState(page.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  function handleOpenChange(value: boolean) {
    setOpen(value);

    // sincroniza apenas ao abrir
    if (value) {
      setTitle(page.title);
      setBio(page.bio ?? "");
    }
  }

  async function handleSave() {
    setError(null);
    setSaving(true);

    try {
      const result = await updatePage({
        id: page.id,
        title: title.trim(),
        bio: bio.trim() || null,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: pageQueryKey(page.id),
      });

      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex flex-col items-start min-w-0 text-left focus-visible:outline-none"
        >
          <span className="font-semibold truncate leading-tight hover:underline hover:cursor-pointer underline-offset-2">
            {page.title}
          </span>

          <span className="text-muted-foreground text-sm truncate hover:underline hover:cursor-pointer underline-offset-2">
            {page.bio ? (
              page.bio
            ) : (
              <span className="italic">Adicionar bio</span>
            )}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Título e bio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="page-title">Título</Label>

            <Input
              id="page-title"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Seu nome ou marca"
            />

            <p className="text-xs text-muted-foreground text-right">
              {title.length} / {TITLE_MAX}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="page-bio">Bio</Label>

            <textarea
              id="page-bio"
              value={bio}
              maxLength={BIO_MAX}
              rows={4}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="text-xs text-muted-foreground text-right">
              {bio.length} / {BIO_MAX}
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            className="w-full"
            disabled={saving || !title.trim()}
            onClick={handleSave}
          >
            {saving && (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            )}

            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}