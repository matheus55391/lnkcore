import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AccountTab } from "@/components/account/account-tab";

type AccountShellProps = {
  activeTab: AccountTab;
  children: React.ReactNode;
};

export function AccountShell({ activeTab, children }: AccountShellProps) {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
          <Link href="/dashboard">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Conta</h1>
      </div>

      <nav className="flex border-b" aria-label="Seções da conta">
        <Link
          href="/profile"
          className={
            activeTab === AccountTab.PROFILE
              ? "flex-1 text-center px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary"
              : "flex-1 text-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          }
        >
          Perfil
        </Link>
        <Link
          href="/billing"
          className={
            activeTab === AccountTab.BILLING
              ? "flex-1 text-center px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary"
              : "flex-1 text-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          }
        >
          Assinatura
        </Link>
      </nav>

      {children}
    </main>
  );
}
