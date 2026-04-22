import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata = { title: "Dashboard · lnkcore" };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <span className="font-semibold">lnkcore</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              {session.user.name ?? session.user.email}
            </span>
            <ModeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold">Olá, {session.user.name}! 👋</h1>
        <p className="text-muted-foreground">
          Em breve você vai poder criar e gerenciar as suas páginas aqui.
        </p>
      </main>
    </div>
  );
}
