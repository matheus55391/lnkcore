import Link from "next/link";
import { ArrowRight, Link2, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/services/auth/get-session";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Link2 className="h-5 w-5" />
            lnkcore
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              {session ? (session.user.name ?? session.user.email) : null}
            </span>
            <nav className="flex items-center gap-2">
              <Button
                asChild
                variant={session ? "outline" : "ghost"}
                size="sm"
                className={
                  session
                    ? "bg-white text-black hover:bg-zinc-100 hover:text-black"
                    : undefined
                }
              >
                <Link href="/sign-in">Entrar</Link>
              </Button>
              {session ? null : (
                <Button asChild size="sm">
                  <Link href="/sign-up">Começar</Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center gap-8 px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Tudo o que importa em um único link
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Um link. Todas as suas páginas.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Crie a sua página lnkcore, reúna seus links, redes sociais e
            conteúdos em um só lugar e compartilhe com o mundo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {session ? null : (
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Criar conta grátis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-in">Já tenho conta</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto grid gap-6 px-6 pb-24 sm:grid-cols-3">
          <Feature
            icon={<Link2 className="h-5 w-5" />}
            title="Múltiplas páginas"
            description="Crie quantas páginas quiser, cada uma com o seu próprio tema e links."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="Editor simples"
            description="Arraste, solte e ative seus links com poucos cliques."
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Login seguro"
            description="Autenticação com cookies httpOnly e sessões criptografadas."
          />
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex h-14 items-center justify-between px-6 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} lnkcore</span>
          <span>Feito com Next.js</span>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted">
        {icon}
      </div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
