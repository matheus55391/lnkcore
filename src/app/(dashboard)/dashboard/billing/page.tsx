import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guards";

export default async function BillingPage() {
  const session = await requireSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Assinatura</h1>
      <p className="mt-2 text-zinc-600">
        Integração Stripe preparada. Nesta fase do MVP, o checkout será
        conectado no próximo incremento.
      </p>
      <button
        type="button"
        data-cy="billing-upgrade"
        className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
      >
        Fazer upgrade para Pro
      </button>
    </div>
  );
}
