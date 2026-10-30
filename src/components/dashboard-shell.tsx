"use client";

import { usePathname } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard-header";

type Props = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: Props) {
  const pathname = usePathname();
  const isEditor = /^\/dashboard\/[^/]+$/.test(pathname);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {isEditor ? null : <DashboardHeader />}
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
