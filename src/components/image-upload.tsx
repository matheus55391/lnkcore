"use client";

import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { uploadPageImage } from "@/actions/pages/upload-page-image";
import { useQueryClient } from "@tanstack/react-query";

type ImageUploadProps = {
    pageId: string;
    initialImage?: string | null;
    size?: number;
    shape?: "circle" | "banner";
};

export function ImageUpload({
    pageId,
    initialImage,
    size = 72,
    shape = "circle",
}: ImageUploadProps) {
    const banner = shape === "banner";
    const [preview, setPreview] = useState(initialImage ?? "");
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        setPreview(initialImage ?? "");
    }, [initialImage]);

    async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("folder", "pages");
            formData.append("entityId", pageId);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error ?? "Upload failed.");
            }

            const { url } = await res.json();
            const result = await uploadPageImage(pageId, url);
            if (!result.success) throw new Error(result.error);

            queryClient.invalidateQueries({ queryKey: ["page", pageId] });
        } catch (err) {
            console.error(err);
            setPreview(initialImage ?? "");
        } finally {
            setUploading(false);
            URL.revokeObjectURL(localUrl);
        }
    }

    return (
        <>
            <button
                type="button"
                aria-label="Alterar imagem da página"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                style={banner ? undefined : { width: size, height: size }}
                className={
                    banner
                        ? "group relative aspect-[4/5] w-full max-w-[14rem] overflow-hidden rounded-2xl bg-muted border border-border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        : "group relative rounded-full overflow-hidden bg-muted border border-border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                }
            >
                {/* Image or empty state */}
                {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={preview}
                        alt="Imagem da página"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="flex w-full h-full items-center justify-center">
                        <Camera className="size-7 text-muted-foreground" />
                    </span>
                )}

                {/* Hover / loading overlay */}
                <span
                    className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${banner ? "" : "rounded-full"} ${uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    aria-hidden
                >
                    {uploading
                        ? <Loader2 className="size-5 text-white animate-spin" />
                        : <Camera className="size-5 text-white" />
                    }
                </span>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
            />
        </>
    );
}

