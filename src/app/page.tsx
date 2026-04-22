import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6">
      <main className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">lnkcore</h1>
        <p className="mt-3 text-zinc-600">
          Plataforma SaaS para criar sua bio page em /seu-slug com dashboard
          autenticado.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Criar conta
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900"
          >
            Entrar
          </Link>
        </div>
      </main>
    </div>
  );
}
