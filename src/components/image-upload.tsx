"use client";

import { Camera } from "lucide-react";
import { useRef, useState } from "react";

type IconImageProps = {
    initialImage?: string;
};

export function IconImage({
    initialImage,
}: IconImageProps) {
    const [preview, setPreview] = useState(
        initialImage || ""
    );

    const inputRef = useRef<HTMLInputElement>(null);

    async function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        // preview local
        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);

        // upload
        const formData = new FormData();

        formData.append("image", file);

        await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
    }

    return (
        <div className="relative w-fit">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-zinc-300"
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Ícone"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-zinc-100 flex items-center justify-center">
                        <Camera className="size-8 text-zinc-500" />
                    </div>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />
        </div>
    );
}