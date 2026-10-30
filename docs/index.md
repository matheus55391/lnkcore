# MakeBio (lnkcore) — Documentação

Plataforma de link-in-bio em português (`makebio.com.br`), construída com Next.js 16, Better Auth, Prisma 7, TanStack Query e Stripe.

## Índice

| Documento | Conteúdo |
| --------- | -------- |
| [Arquitetura](./ARCHITECTURE.md) | Stack, pastas, Server Actions, TanStack Query |
| [Página pública e editor](./public-page.md) | Layouts Clássico/Capa, tipos de link, preview |
| [Getting Started](./getting-started.md) | Ambiente local |
| [Autenticação](./auth.md) | Better Auth, sessão, rotas |
| [Banco de Dados](./database.md) | Schema Prisma, `PageLayout`, `LinkType` |
| [Billing (Stripe)](./billing.md) | Planos FREE/PRO, checkout e webhook |
| [Storage](./storage.md) | MinIO / S3 |
| [Deploy](./deployment.md) | Produção (GHCR + VPS) |

## Visão geral

Cada conta tem **Pages** com slug único. A pública vive em `/{slug}`. Uma page tem layout, tema, cabeçalho e **Links** de três tipos.

```
User
 └── Page (slug, título, bio, imagem, themeId, layout CLASSIC|COVER)
      └── Link (CLASSIC | FEATURED | SOCIAL)
```

## Planos

Fonte: [`src/lib/plan-limits.ts`](../src/lib/plan-limits.ts). O painel anuncia PRO a **R$ 7/mês**; o valor cobrado é o Price ID do Stripe.

| Plano | Páginas | Links por página | Imagens |
| ----- | :-----: | :--------------: | :-----: |
| FREE | 1 | 5 | 10 |
| PRO | 5 | 20 | 40 |

Regras validadas **no server** via [`src/lib/plan.ts`](../src/lib/plan.ts).
