"use client";

import { ExternalLinkIcon, GlobeIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { CreatePageDialog } from "@/components/pages/create-page-dialog";
import { ProfileAvatar } from "@/components/profile-avatar";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/queries/use-current-user-query";
import { usePages } from "@/queries/use-pages-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageCard } from "@/components/page-card";

export default function DashboardPage() {
  const { data: pages, isLoading } = usePages();
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <span className="font-semibold tracking-tight">lnkcore</span>
          <div className="flex items-center gap-3 text-sm">
            <UpgradeButton />
            {
              currentUser && (
                <ProfileAvatar user={currentUser} />
              )
            }
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Suas páginas</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie as suas páginas aqui.
            </p>
          </div>
          <CreatePageDialog />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !pages || pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center gap-4">
            <GlobeIcon className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Nenhuma página ainda</p>
              <p className="text-muted-foreground text-sm">
                Crie sua primeira página e comece a compartilhar seus links.
              </p>
            </div>
            <CreatePageDialog />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Link key={page.id} href={`/dashboard/${page.id}`}>
                <PageCard page={page} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
