"use client";

import { useCurrentUser } from "@/queries/use-current-user-query";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { ProfileAvatar } from "@/components/profile-avatar";
import Link from "next/link";

export function DashboardHeader() {
  const { data: currentUser } = useCurrentUser();

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          makebio
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <UpgradeButton />
          {currentUser && <ProfileAvatar user={currentUser} />}
        </div>
      </div>
    </header>
  );
}
