import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Bio page própria",
    description:
      "Crie sua página personalizada em lnkcore.com/seu-slug e compartilhe com qualquer pessoa.",
  },
  {
    title: "Links ilimitados",
    description:
      "Adicione quantos links quiser: redes sociais, portfólio, projetos e mais.",
  },
  {
    title: "Dashboard simples",
    description:
      "Gerencie tudo em um painel limpo e intuitivo. Sem complicações.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="font-bold tracking-tight">lnkcore</span>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Criar conta</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <Badge variant="secondary" className="mb-4">
            Grátis para começar
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Seu hub de links em{" "}
            <span className="text-primary">um único lugar</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Crie sua bio page personalizada, organize seus links e compartilhe
            tudo com uma única URL. Simples assim.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Criar minha página grátis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            lnkcore.com/<span className="font-medium text-foreground">seu-slug</span>
          </p>
        </section>

        <Separator />

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
            Tudo que você precisa
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-2">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* CTA */}
        <section className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Pronto para começar?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Crie sua conta e tenha sua bio page no ar em menos de 2 minutos.
          </p>
          <Button className="mt-6" size="lg" asChild>
            <Link href="/register">Criar conta grátis</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} lnkcore. Feito com Next.js.
      </footer>
    </div>
  );
}
