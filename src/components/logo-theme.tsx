"use client";

import Image from "next/image";

export function LogoTheme() {
    return (
        <>
            <Image
                src="/mkbio.png"
                alt="makebio"
                width={32}
                height={32}
                className="hidden dark:block"
            />
            <Image
                src="/mkbioblack.png"
                alt="makebio"
                width={32}
                height={32}
                className="block dark:hidden"
            />
        </>
    );
}