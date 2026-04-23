# Billing (Stripe)

O lnkcore tem dois planos:

| Plano | Preço | Páginas | Links por página |
| ----- | ----- | :-----: | :--------------: |
| FREE  | grátis (padrão ao cadastrar) | 1 | 10 |
| PRO   | R$10 / mês | ilimitado | ilimitado |

## Configuração

Variáveis de ambiente necessárias:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

- `STRIPE_PRO_PRICE_ID` → crie um produto no dashboard do Stripe com preço recorrente mensal (R$10 BRL) e copie o **Price ID**.
- `STRIPE_WEBHOOK_SECRET` → gerado ao cadastrar o endpoint `/api/stripe/webhook` (ou via `stripe listen --forward-to localhost:3000/api/stripe/webhook` em dev).

## Fluxo de upgrade

```
[Dashboard] UpgradeButton
     │  onClick → useMutation
     ▼
[Server Action] createCheckoutSession()
     │  1. requireSession()
     │  2. cria stripeCustomerId se ainda não existir
     │  3. stripe.checkout.sessions.create({ mode: "subscription", price: PRO_PRICE_ID })
     ▼
window.location = checkout.url
     │
     ▼
[Stripe Checkout] usuário paga
     │
     ├── success_url → /dashboard?upgraded=1
     └── webhook   → POST /api/stripe/webhook
                       │
                       ▼
                     event: checkout.session.completed
                       └── prisma.user.update({ plan: "PRO", stripeSubscriptionId })
```

## Eventos tratados no webhook

Arquivo: [src/app/api/stripe/webhook/route.ts](../src/app/api/stripe/webhook/route.ts)

| Evento | Ação |
| ------ | ---- |
| `checkout.session.completed` | Define `plan = PRO`, grava `stripeSubscriptionId` |
| `customer.subscription.updated` | `plan = PRO` se `status ∈ {active, trialing}`, senão `FREE` |
| `customer.subscription.deleted` | `plan = FREE` |
| `customer.subscription.paused` | `plan = FREE` |

A assinatura é verificada com `stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET)`. Requisições sem signature válida retornam `400`.

## Validação de plano

Arquivo: [src/lib/plan.ts](../src/lib/plan.ts) (marcado com `server-only`).

```ts
export const PLAN_LIMITS = {
  FREE: { maxPages: 1, maxLinksPerPage: 10 },
  PRO:  { maxPages: Infinity, maxLinksPerPage: Infinity },
};

export async function assertCanCreatePage(userId: string): Promise<void>
export async function assertCanCreateLink(userId: string, pageId: string): Promise<void>
```

Quando o limite é atingido, lançam `PlanLimitError`. As Server Actions convertem esse erro em `{ success: false, error: "Limite do plano gratuito atingido..." }`.

> **Nunca confie no client.** Botões podem estar desabilitados por UX, mas a validação real é sempre no server.

## Testando localmente (Stripe CLI)

```bash
# 1. Login
stripe login

# 2. Redirecionar webhooks para o app local
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# Copie o "whsec_..." mostrado pela CLI e coloque em STRIPE_WEBHOOK_SECRET

# 3. Em outro terminal, rode o app
npm run dev

# 4. Disparar upgrade pela UI ou simular evento:
stripe trigger checkout.session.completed
```
