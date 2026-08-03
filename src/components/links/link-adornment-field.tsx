"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Smile, ImageIcon, Ban } from "lucide-react";

import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import { uploadImageFile } from "@/lib/upload-client";
import { LinkIconPicker } from "./link-icon-picker";

export type AdornmentMode = "none" | "emoji" | "image";

type Props = {
  emoji: string | null;
  image: string | null;
  onChange: (next: { emoji: string | null; image: string | null }) => void;
  /** Used as storage entityId: `{userId}/links/{entityId}/avatar.webp` */
  entityId: string;
  disabled?: boolean;
};

function resolveMode(emoji: string | null, image: string | null): AdornmentMode {
  if (image) return "image";
  if (emoji) return "emoji";
  return "none";
}

const MODES: { id: AdornmentMode; label: string; Icon: typeof Smile }[] = [
  { id: "none", label: "Nenhum", Icon: Ban },
  { id: "emoji", label: "Emoji", Icon: Smile },
  { id: "image", label: "Imagem", Icon: ImageIcon },
];

export function LinkAdornmentField({
  emoji,
  image,
  onChange,
  entityId,
  disabled,
}: Props) {
  const [mode, setMode] = useState<AdornmentMode>(() =>
    resolveMode(emoji, image)
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = localPreview ?? image;

  function selectMode(next: AdornmentMode) {
    setMode(next);
    setUploadError(null);
    if (next === "none") {
      onChange({ emoji: null, image: null });
      setLocalPreview(null);
    } else if (next === "emoji") {
      onChange({ emoji, image: null });
      setLocalPreview(null);
    } else {
      onChange({ emoji: null, image });
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);
    setUploadError(null);

    try {
      const url = await uploadImageFile(file, "links", entityId);
      onChange({ emoji: null, image: url });
      setLocalPreview(null);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Falha no upload."
      );
      setLocalPreview(null);
      onChange({ emoji: null, image });
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <FormField>
      <Label className="mb-0">Ícone</Label>
      <p className="text-muted-foreground text-xs">
        Opcional. Emoji/ícone ou foto — aparece à esquerda do link.
      </p>

      <div className="bg-muted grid grid-cols-3 gap-1 rounded-md p-1">
        {MODES.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            disabled={disabled || uploading}
            onClick={() => selectMode(id)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              mode === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {mode === "emoji" && (
        <LinkIconPicker
          value={emoji}
          onChange={(v) => onChange({ emoji: v, image: null })}
          disabled={disabled || uploading}
          embedded
        />
      )}

      {mode === "image" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Enviar imagem do link"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="bg-muted group relative size-16 shrink-0 overflow-hidden rounded-full border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Prévia do ícone"
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center">
                <Camera className="text-muted-foreground size-6" />
              </span>
            )}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                uploading
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
              aria-hidden
            >
              {uploading ? (
                <Loader2 className="size-5 animate-spin text-white" />
              ) : (
                <Camera className="size-5 text-white" />
              )}
            </span>
          </button>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-muted-foreground text-xs">
              JPEG, PNG, WebP ou GIF. Máx. 5 MB.
            </p>
            {preview && (
              <button
                type="button"
                className="text-muted-foreground text-xs underline"
                disabled={disabled || uploading}
                onClick={() => {
                  onChange({ emoji: null, image: null });
                  setLocalPreview(null);
                }}
              >
                Remover imagem
              </button>
            )}
            {uploadError && (
              <p className="text-destructive text-xs">{uploadError}</p>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </FormField>
  );
}
