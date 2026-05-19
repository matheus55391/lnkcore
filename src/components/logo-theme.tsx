"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

export function LogoTheme() {
    const { resolvedTheme } = useTheme();

    return (
        <Image
            src={resolvedTheme === 'light' ? '/mkbioblack.png' : '/mkbio.png'}
            alt="makebio"
            width={32}
            height={32}
        />
    );
}