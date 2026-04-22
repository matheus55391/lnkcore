import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { requireSession } from "@/lib/auth/guards";
import { listUserLinks } from "@/modules/link/service";
import { getPageByUserId } from "@/modules/page/service";

export default async function DashboardPage() {
  const session = await requireSession();
  if (!session) {
    redirect("/login");
  }

  const [page, links] = await Promise.all([
    getPageByUserId(session.userId),
    listUserLinks(session.userId),
  ]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-zinc-600">
            Gerencie sua página pública e links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/billing"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            Assinatura
          </Link>
          <Link
            href={page ? `/${page.slug}` : "#"}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            Ver página pública
          </Link>
        </div>
      </header>

      <DashboardClient initialPage={page} initialLinks={links} />
    </div>
  );
}
