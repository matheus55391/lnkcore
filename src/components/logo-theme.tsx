"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

export function LogoTheme() {
    const { resolvedTheme } = useTheme();

    return (
        <Image
            src="/mkbio.png"
            alt="makebio"
            width={32}
            height={32}
            style={{
                filter:
                    resolvedTheme === "light"
                        ? "invert(1)"
                        : "invert(0)",
            }}
            priority
        />
    );
}
