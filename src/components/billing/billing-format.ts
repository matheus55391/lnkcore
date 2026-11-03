import { PaymentStatus, SubscriptionStatus } from "@/@types";

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function formatBillingDate(
  date: Date | string | null | undefined,
): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

type StatusPresentation = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

const SUBSCRIPTION_STATUS_LABELS: Record<
  SubscriptionStatus,
  StatusPresentation
> = {
  [SubscriptionStatus.ACTIVE]: { label: "Ativa", variant: "default" },
  [SubscriptionStatus.TRIALING]: { label: "Trial", variant: "secondary" },
  [SubscriptionStatus.PAST_DUE]: {
    label: "Pagamento pendente",
    variant: "destructive",
  },
  [SubscriptionStatus.CANCELED]: { label: "Cancelada", variant: "outline" },
  [SubscriptionStatus.UNPAID]: {
    label: "Inadimplente",
    variant: "destructive",
  },
  [SubscriptionStatus.PAUSED]: { label: "Pausada", variant: "secondary" },
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, StatusPresentation> = {
  [PaymentStatus.PAID]: { label: "Pago", variant: "default" },
  [PaymentStatus.OPEN]: { label: "Em aberto", variant: "secondary" },
  [PaymentStatus.VOID]: { label: "Anulado", variant: "outline" },
  [PaymentStatus.UNCOLLECTIBLE]: {
    label: "Incobrável",
    variant: "destructive",
  },
};

function isSubscriptionStatus(status: string): status is SubscriptionStatus {
  return Object.values(SubscriptionStatus).includes(
    status as SubscriptionStatus,
  );
}

function isPaymentStatus(status: string): status is PaymentStatus {
  return Object.values(PaymentStatus).includes(status as PaymentStatus);
}

export function subscriptionStatusLabel(status: string): StatusPresentation {
  if (isSubscriptionStatus(status)) {
    return SUBSCRIPTION_STATUS_LABELS[status];
  }
  return { label: status, variant: "outline" };
}

export function paymentStatusLabel(status: string): StatusPresentation {
  if (isPaymentStatus(status)) {
    return PAYMENT_STATUS_LABELS[status];
  }
  return { label: status, variant: "outline" };
}
