# Arquitetura

## Stack

| Camada | Tecnologia | Versão |
| ------ | ---------- | ------ |
| Framework | Next.js (App Router) | 16 |
| Linguagem | TypeScript | 5 |
| Runtime UI | React | 19 |
| Autenticação | Better Auth | 1.x |
| ORM | Prisma | 7 |
| Driver Postgres | `@prisma/adapter-pg` | 7 |
| Banco de dados | PostgreSQL | 16 |
| Data fetching (client) | TanStack Query | 5 |
| Formulários | react-hook-form + zod | — |
| Pagamentos | Stripe | — |
| Object storage | MinIO (S3-compatible) | latest |
| Estilo | Tailwind CSS | v4 |
| Componentes | Radix UI + shadcn | — |

## Princípios

- **Dashboard = Client Components + TanStack Query**. Sem SSR, sem `revalidatePath`.
- **Mutations = Server Actions** tipadas, com Zod **no server**, retornando `{ success: true, data? } | { success: false, error }`.
- **Página pública `/[slug]` = Server Component** (SSR simples, Prisma direto).
- **Stripe webhook = Route Handler** (`app/api/stripe/webhook/route.ts`).
- **Tipos desacoplados do Prisma** em `src/@types/` — frontend nunca importa do client gerado.
- **Regras de negócio (planos) sempre no server** — nunca confiar no client.

## Estrutura de pastas

```
lnkcore/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root (fonte Geist, ThemeProvider)
│   │   ├── page.tsx                  # Landing pública
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/                   # sign-in, sign-up
│   │   │   ├── layout.tsx
│   │   │   ├── sign-in/page.tsx
│   │   │   └── sign-up/page.tsx
│   │   │
│   │   ├── (dashboard)/              # rotas privadas — CLIENT + React Query
│   │   │   ├── layout.tsx            # QueryProvider + requireSession
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Lista de páginas (useQuery)
│   │   │       └── [pageId]/page.tsx # Detalhe + LinksManager
│   │   │
│   │   ├── [slug]/page.tsx           # Página pública — SSR + Prisma
│   │   │
│   │   └── api/
│   │       ├── auth/[...all]/route.ts
│   │       └── stripe/webhook/route.ts
│   │
│   ├── actions/                      # Server Actions (1 arquivo por função)
│   │   ├── pages/
│   │   │   ├── create-page.ts
│   │   │   ├── update-page.ts
│   │   │   ├── delete-page.ts
│   │   │   └── list-pages.ts
│   │   ├── links/
│   │   │   ├── create-link.ts
│   │   │   ├── update-link.ts
│   │   │   ├── delete-link.ts
│   │   │   └── list-links.ts
│   │   └── stripe/
│   │       └── create-checkout-session.ts
│   │
│   ├── components/
│   │   ├── auth/                     # sign-in-form, sign-up-form, sign-out-button
│   │   ├── billing/
│   │   │   └── upgrade-button.tsx
│   │   ├── links/
│   │   │   └── links-manager.tsx     # Lista + CreateLinkDialog (RHF + mutations)
│   │   ├── pages/
│   │   │   └── create-page-dialog.tsx
│   │   └── ui/                       # shadcn primitives
│   │
│   ├── hooks/                        # TanStack Query hooks
│   │   ├── use-pages.ts              # usePages() + pagesQueryKey
│   │   └── use-links.ts              # useLinks(pageId) + linksQueryKey
│   │
│   ├── schemas/                      # Zod — compartilhados client/server
│   │   ├── auth.ts
│   │   ├── pages.ts                  # create/update/delete
│   │   └── links.ts                  # create/update/delete
│   │
│   ├── @types/                       # DTOs desacoplados do Prisma
│   │   ├── page.ts, link.ts, user.ts, plan.ts, session.ts...
│   │   └── action-result.ts          # ActionResult<T>
│   │
│   ├── lib/                          # Integrações e clientes
│   │   ├── prisma.ts                 # PrismaClient singleton
│   │   ├── auth.ts                   # Better Auth (server)
│   │   ├── auth-client.ts            # Better Auth (browser)
│   │   ├── stripe.ts                 # Stripe client [server-only]
│   │   ├── plan.ts                   # assertCanCreatePage/Link [server-only]
│   │   ├── query-provider.tsx        # QueryClientProvider + Devtools
│   │   └── utils.ts                  # cn()
│   │
│   ├── utils/
│   │   └── session.ts                # getSession(), requireSession() [server-only]
│   │
│   ├── generated/prisma/             # Cliente Prisma gerado (gitignored)
│   └── proxy.ts                      # Middleware de proteção (edge)
│
├── docker-compose.yml
├── next.config.ts
├── prisma.config.ts
└── tsconfig.json
```

## Fluxos

### Dashboard (privado)

```
Browser (Client Component)
  │
  ├── useQuery(["pages"], () => listPages())          ← Server Action como queryFn
  │
  └── useMutation(createPage)                         ← Server Action
        ↓ success
        queryClient.invalidateQueries(["pages"])       ← refaz o useQuery
```

- `src/app/(dashboard)/layout.tsx` chama `requireSession()` no server e envolve os filhos com `QueryProvider`.
- As pages são `"use client"` e consomem hooks de [src/hooks](../src/hooks).

### Página pública (SSR)

```
GET /[slug]
  └── Server Component
        └── prisma.page.findUnique({ where: { slug } })
              └── render HTML
```

Sem React Query, sem client.

### Mutations (Server Actions)

Toda action segue o mesmo contrato:

```ts
"use server";
export async function createPage(input: CreatePageInput): Promise<ActionResult<Page>> {
  const parsed = createPageSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const session = await requireSession();
  await assertCanCreatePage(session.user.id);   // regra de plano

  // ...prisma.page.create
  return { success: true, data: page };
}
```

No client:

```ts
const mutation = useMutation({
  mutationFn: async (values) => {
    const res = await createPage(values);
    if (!res.success) throw new Error(res.error);
    return res.data;
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: pagesQueryKey }),
});
```

## Decisões de design

### `lib/` vs `utils/`
- **`lib/`** guarda **integrações/clientes** (Prisma, Better Auth, Stripe, QueryClient, regras de plano que falam com DB).
- **`utils/`** guarda **helpers puros** (wrappers finos como `getSession`/`requireSession`).

### `server-only`
Arquivos que acessam headers/cookies ou segredos (Prisma, Stripe, session, plan) importam `"server-only"` para falhar em build se forem importados por Client Components.

### Actions granulares (1 arquivo = 1 função)
Facilita tree-shaking, leitura e testes. Agrupadas por recurso em `src/actions/<recurso>/`.

### Tipos desacoplados em `src/@types/`
Frontend nunca importa de `@/generated/prisma`. DTOs explícitos evitam vazar colunas sensíveis e desacoplam do schema.

### Middleware leve (`src/proxy.ts`)
Verifica apenas a **presença** do cookie (`getSessionCookie`). A validação real da sessão acontece no server (`auth.api.getSession`) dentro do layout do dashboard.

### Prisma com driver nativo (`@prisma/adapter-pg`)
Permite uso em edge runtimes e melhora compatibilidade serverless.
