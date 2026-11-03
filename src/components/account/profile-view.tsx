"use client";

import { Loader2Icon } from "lucide-react";

import { Plan } from "@/@types";
import { AccountShell } from "@/components/account/account-shell";
import { AccountTab } from "@/components/account/account-tab";
import { PersonalInfoCard } from "@/components/account/personal-info-card";
import { PasswordCard } from "@/components/account/password-card";
import { DeleteAccountCard } from "@/components/account/delete-account-card";
import { useCurrentUser } from "@/queries/use-current-user-query";

export function ProfileView() {
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <AccountShell activeTab={AccountTab.PROFILE}>
        <div className="flex justify-center py-20">
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell activeTab={AccountTab.PROFILE}>
      <PersonalInfoCard currentUser={currentUser} />
      <PasswordCard />
      <DeleteAccountCard isPro={currentUser?.plan === Plan.PRO} />
    </AccountShell>
  );
}
