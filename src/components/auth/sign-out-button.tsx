"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

import { signOut } from "@/lib/auth-client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={loading}
      onSelect={(e) => {
        e.preventDefault();
        void handleClick();
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </DropdownMenuItem>
  );
}