"use client";

import { useEffect } from "react";

/**
 * Keeps auth screens visually light without changing the global theme preference.
 * Temporarily strips `.dark` from <html> while mounted.
 */
export function AuthLightScope({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    root.classList.remove("dark");
    root.classList.add("light");

    return () => {
      root.classList.remove("light");
      if (hadDark) root.classList.add("dark");
    };
  }, []);

  return <>{children}</>;
}
