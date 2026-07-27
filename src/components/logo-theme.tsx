"use client";

import Image from "next/image";

type Props = {
  /** Force a specific logo regardless of color scheme (e.g. landing is always light). */
  force?: "light" | "dark";
};

export function LogoTheme({ force }: Props) {
  if (force === "light") {
    return (
      <Image
        src="/mkbioblack.png"
        alt="makebio"
        width={32}
        height={32}
      />
    );
  }

  if (force === "dark") {
    return (
      <Image src="/mkbio.png" alt="makebio" width={32} height={32} />
    );
  }

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
