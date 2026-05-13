# lnkcore — Documentação

Bem-vindo à documentação do **lnkcore**, uma plataforma de link-in-bio construída com Next.js 16, Better Auth, Prisma 7, TanStack Query e Stripe.

## Índice

| Documento | Conteúdo |
| --------- | -------- |
| [Arquitetura](./ARCHITECTURE.md) | Stack, estrutura de pastas, padrões (Server Actions, TanStack Query, RHF) |
| [Getting Started](./getting-started.md) | Pré-requisitos, configuração do ambiente e execução local |
| [Autenticação](./auth.md) | Better Auth, sessão no server, proteção de rotas |
| [Banco de Dados](./database.md) | Schema Prisma, modelos e comandos de migração |
| [Billing (Stripe)](./billing.md) | Planos FREE/PRO, checkout e webhook |
| [Storage](./storage.md) | Configuração do MinIO / S3 para arquivos e imagens |
| [Deploy](./deployment.md) | Guia de implantação em produção |

## Visão Geral

O lnkcore permite que usuários criem páginas públicas com múltiplos links (estilo Linktree). Cada usuário pode ter uma ou mais **Pages** (conforme o plano), cada página possui um **slug** único e uma lista de **Links** ordenados.

```
User
 └── Page (slug único, título, bio, imagem)
      └── Link (título, URL, posição, ativo/inativo)
```

## Planos

| Plano | Páginas | Links por página |
| ----- | :-----: | :--------------: |
| FREE  | 1 | 10 |
| PRO (R$10) | ilimitado | ilimitado |

As regras são validadas **no server**, dentro das Server Actions, via [src/lib/plan.ts](../src/lib/plan.ts).

