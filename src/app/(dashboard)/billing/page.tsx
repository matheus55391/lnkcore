"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  Loader2Icon,
  ExternalLinkIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useBillingQuery } from "@/queries/use-billing-query";
import { useCancelSubscriptionMutation } from "@/queries/use-cancel-subscription-mutation";
import { useCreateCheckoutSessionMutation } from "@/queries/use-create-checkout-session-mutation";
import type { BillingSubscription, BillingPayment } from "@/actions/stripe/get-billing-info";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function statusLabel(status: string) {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    active: { label: "Ativa", variant: "default" },
    trialing: { label: "Trial", variant: "secondary" },
    past_due: { label: "Pagamento pendente", variant: "destructive" },
    canceled: { label: "Cancelada", variant: "outline" },
    unpaid: { label: "Inadimplente", variant: "destructive" },
    paused: { label: "Pausada", variant: "secondary" },
  };
  return map[status] ?? { label: status, variant: "outline" as const };
}

function paymentStatusLabel(status: string) {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    paid: { label: "Pago", variant: "default" },
    open: { label: "Em aberto", variant: "secondary" },
    void: { label: "Anulado", variant: "outline" },
    uncollectible: { label: "Incobrável", variant: "destructive" },
  };
  return map[status] ?? { label: status, variant: "outline" as const };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BillingPage() {
  const { data, isLoading } = useBillingQuery();

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

      <div className="flex border-b">
        <Link
          href="/profile"
          className="flex-1 text-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Perfil
        </Link>
        <Link
          href="/billing"
          className="flex-1 text-center px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary"
        >
          Assinatura
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <PlanSection
            plan={data?.plan ?? "FREE"}
            subscription={data?.subscription ?? null}
          />
          {(data?.plan ?? "FREE") === "FREE" && <PlanComparisonSection />}
          <PaymentsSection payments={data?.payments ?? []} />
        </>
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Plan comparison (shown for FREE users)
// ---------------------------------------------------------------------------

const PLAN_FEATURES = [
  { label: "Páginas", free: "1 página", pro: "5 páginas" },
  { label: "Links por página", free: "5 links", pro: "20 links" },
] as const;

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value
      ? <CheckIcon className="h-4 w-4 text-green-500 mx-auto" />
      : <XIcon className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  }
  return <span>{value}</span>;
}

function PlanComparisonSection() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>O que muda com o PRO?</CardTitle>
        <CardDescription>Por apenas R$&nbsp;7/mês.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-muted-foreground font-medium w-1/2">Recurso</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground w-1/4">FREE</th>
              <th className="px-4 py-3 text-center font-semibold text-primary w-1/4 bg-primary/5">
                PRO
              </th>
            </tr>
          </thead>
          <tbody>
            {PLAN_FEATURES.map((f) => (
              <tr key={f.label} className="border-b last:border-0">
                <td className="px-6 py-3 text-muted-foreground">{f.label}</td>
                <td className="px-4 py-3 text-center">
                  <FeatureValue value={f.free} />
                </td>
                <td className="px-4 py-3 text-center font-medium bg-primary/5">
                  <FeatureValue value={f.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-5">
          <UpgradeButton />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Plan card
// ---------------------------------------------------------------------------

function UpgradeButton() {
  const [error, setError] = useState<string | null>(null);
  const mutation = useCreateCheckoutSessionMutation({
    onError: (err) => setError(err.message),
  });

  return (
    <div className="space-y-2">
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
        Assinar agora
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PlanSection({
  plan,
  subscription,
}: {
  plan: "FREE" | "PRO";
  subscription: BillingSubscription | null;
}) {
  if (plan === "FREE" || !subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Plano atual
            <Badge variant="secondary">FREE</Badge>
          </CardTitle>
          <CardDescription>
            Faça upgrade para o plano PRO e desbloqueie todos os recursos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpgradeButton />
        </CardContent>
      </Card>
    );
  }

  const { label, variant } = statusLabel(subscription.status);
  const isCancelScheduled = subscription.cancelAtPeriodEnd;
  const isCanceled = subscription.status === "canceled";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Plano atual
          <Badge variant="default">PRO</Badge>
          <Badge variant={variant}>{label}</Badge>
        </CardTitle>
        <CardDescription>
          {isCanceled
            ? "Sua assinatura foi cancelada."
            : isCancelScheduled
              ? `Acesso PRO até ${formatDate(subscription.currentPeriodEnd)}. Após essa data o plano volta para FREE.`
              : `Próxima cobrança em ${formatDate(subscription.currentPeriodEnd)}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">Período atual</p>
            <p>{formatDate(subscription.currentPeriodStart)} – {formatDate(subscription.currentPeriodEnd)}</p>
          </div>
          {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">Trial termina em</p>
              <p>{formatDate(subscription.trialEnd)}</p>
            </div>
          )}
        </div>

        {isCancelScheduled && !isCanceled && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangleIcon className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              A renovação automática foi desativada. Você continua com acesso PRO até{" "}
              <strong>{formatDate(subscription.currentPeriodEnd)}</strong>.
            </p>
          </div>
        )}

        {!isCanceled && !isCancelScheduled && (
          <CancelButton />
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Cancel button + confirmation dialog
// ---------------------------------------------------------------------------

function CancelButton() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useCancelSubscriptionMutation({
    onSuccess: () => setOpen(false),
    onError: (err) => setServerError(err.message),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setServerError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive">
          Cancelar renovação automática
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancelar renovação automática?</DialogTitle>
          <DialogDescription>
            Você continuará com acesso PRO até o fim do período atual. Após essa
            data, o plano voltará automaticamente para FREE. Nenhum reembolso
            será emitido.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Manter assinatura
          </Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirmar cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Payment history
// ---------------------------------------------------------------------------

function PaymentsSection({ payments }: { payments: BillingPayment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de pagamentos</CardTitle>
        <CardDescription>
          Últimas cobranças da sua assinatura.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nenhum pagamento registrado.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-120">
              <thead>
                <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="px-2 py-2 text-left font-medium">Data</th>
                  <th className="px-2 py-2 text-left font-medium">Período</th>
                  <th className="px-2 py-2 text-right font-medium">Valor</th>
                  <th className="px-2 py-2 text-center font-medium">Status</th>
                  <th className="px-2 py-2 text-center font-medium">Fatura</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => {
                  const { label, variant } = paymentStatusLabel(p.status);
                  return (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-2 py-3 whitespace-nowrap">
                        {formatDate(p.paidAt ?? p.createdAt)}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-muted-foreground">
                        {p.periodStart && p.periodEnd
                          ? `${formatDate(p.periodStart)} – ${formatDate(p.periodEnd)}`
                          : "—"}
                      </td>
                      <td className="px-2 py-3 text-right font-medium tabular-nums whitespace-nowrap">
                        {formatCurrency(p.amount, p.currency)}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {p.invoiceUrl && (
                            <a
                              href={p.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Ver fatura"
                            >
                              <ExternalLinkIcon className="h-4 w-4" />
                            </a>
                          )}
                          {p.invoicePdf && (
                            <a
                              href={p.invoicePdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Baixar PDF"
                            >
                              <FileTextIcon className="h-4 w-4" />
                            </a>
                          )}
                          {!p.invoiceUrl && !p.invoicePdf && (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
