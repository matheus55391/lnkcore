import { ExternalLinkIcon, FileTextIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatBillingDate,
  formatCurrency,
  paymentStatusLabel,
} from "@/components/billing/billing-format";
import type { BillingPayment } from "@/actions/stripe/get-billing-info";

type PaymentsCardProps = {
  payments: BillingPayment[];
};

export function PaymentsCard({ payments }: PaymentsCardProps) {
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
                {payments.map((payment) => {
                  const { label, variant } = paymentStatusLabel(payment.status);
                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-2 py-3 whitespace-nowrap">
                        {formatBillingDate(payment.paidAt ?? payment.createdAt)}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-muted-foreground">
                        {payment.periodStart && payment.periodEnd
                          ? `${formatBillingDate(payment.periodStart)} – ${formatBillingDate(payment.periodEnd)}`
                          : "—"}
                      </td>
                      <td className="px-2 py-3 text-right font-medium tabular-nums whitespace-nowrap">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {payment.invoiceUrl && (
                            <a
                              href={payment.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Ver fatura"
                            >
                              <ExternalLinkIcon className="h-4 w-4" />
                            </a>
                          )}
                          {payment.invoicePdf && (
                            <a
                              href={payment.invoicePdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Baixar PDF"
                            >
                              <FileTextIcon className="h-4 w-4" />
                            </a>
                          )}
                          {!payment.invoiceUrl && !payment.invoicePdf && (
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
