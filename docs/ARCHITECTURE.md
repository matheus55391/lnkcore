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
├── prisma/schema.prisma + migrations/
├── docs/                             # Este conjunto
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing
│   │   ├── (auth)/                   # sign-in, sign-up, reset
│   │   ├── (dashboard)/dashboard/
│   │   │   ├── page.tsx              # Lista de páginas
│   │   │   └── [pageId]/page.tsx     # Editor (trilho + preview)
│   │   ├── [slug]/page.tsx           # Pública: Prisma + SlugPageView
│   │   └── api/                      # auth, stripe, upload
│   ├── actions/                      # Server Actions (1 arquivo = 1 função)
│   ├── components/
│   │   ├── editor/                   # PageEditor, phone, rail, painéis
│   │   ├── public/                   # header, links, estilos da /{slug}
│   │   ├── links/                    # dialogs CLASSIC / FEATURED / SOCIAL
│   │   └── ui/
│   ├── queries/                      # TanStack Query (usePages, useLinks, …)
│   ├── schemas/                      # Zod compartilhado
│   ├── @types/                       # DTOs (nunca importar generated/prisma)
│   ├── lib/                          # prisma, auth, stripe, plan, themes, discord-log
│   └── proxy.ts
└── docker-compose.yml
```

Layouts e tipos de link: [Página pública e editor](./public-page.md).

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
- Páginas do dashboard são `"use client"` e consomem hooks em [src/queries](../src/queries).
- `/dashboard/[pageId]` monta o [`PageEditor`](../src/components/editor/page-editor.tsx) (Links / Cabeçalho / Aparência + preview iPhone). O header do shell some nessa rota.

### Página pública

```
GET /[slug]
  └── Server Component
        └── prisma.page.findUnique({ slug, published, links active })
              └── SlugPageView (client)
                    CLASSIC → avatar + bio + sociais + botões
                    COVER   → hero 4:5 + fade do tema + card “celular” no desktop
```

Fetch no server; hidratação no client só para share/modais. Estilos em [`slug-page-styles.ts`](../src/components/public/slug-page-styles.ts) (`data-layout="cover"|"classic"`). Detalhe visual: [public-page.md](./public-page.md).

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
