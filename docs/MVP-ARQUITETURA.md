# lnkcore MVP - Documento Principal

Este documento define a base arquitetural do SaaS `lnkcore` (clone de Linktree) em **um unico projeto Next.js App Router**, sem monorepo.

## Stack

- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- Better Auth com cookie HttpOnly (sessao server-side)
- Zod para validacao de entrada
- TanStack Query para server state
- Zustand para estado de UI
- Stripe (estrutura pronta)
- MinIO (S3 compativel local)

## Dominios

- `auth`: Better Auth (email/senha), sessao e preparo para OAuth
- `user`: tenant principal
- `page`: pagina publica do perfil
- `link`: CRUD e ordenacao por `position`
- `billing`: assinatura free/pro via Stripe

## Estrutura de pastas

- `src/app`: rotas App Router
- `src/app/(auth)`: telas de login e registro
- `src/app/(dashboard)`: area autenticada
- `src/app/[slug]`: pagina publica por slug
- `src/app/api`: endpoints HTTP
- `src/modules`: regras de negocio por dominio
- `src/lib`: infraestrutura compartilhada (`prisma`, `auth`, `stripe`, `storage`)
- `src/schemas`: contratos Zod

## Seguranca

- Cookies HttpOnly para sessao
- Validacao server-side em todos os handlers
- Ownership check em rotas de dashboard (dados filtrados por `userId`)
- Sanitizacao de URL para links publicos
- Validacao de sessao server-side via Better Auth em rotas protegidas

## Ambiente local com Docker

Servicos locais:

- PostgreSQL na porta `5432`
- MinIO API na porta `9000`
- MinIO Console na porta `9001`

Comandos:

1. `cp .env.example .env`
2. `npm run db:up`
3. `npm run prisma:generate`
4. `npm run prisma:migrate`
5. `npm run dev`

## Escopo MVP implementado

- Modelagem Prisma para `User`, `Page`, `Link`, `Subscription`
- Better Auth em `/api/auth/[...all]` (sign-up/sign-in/sign-out/get-session)
- Setup inicial de tenant em `/api/auth/setup` (cria `Page` e `Subscription` free)
- API de dashboard para atualizar `Page`
- API de links (listar, criar, editar, deletar)
- Rota publica `/${slug}` com metadados dinamicos (SEO/OG)
- Base de providers para TanStack Query e store de UI com Zustand

## Itens preparados para proxima fase

- OAuth completo Google/Apple
- Upload de imagem com presigned URL em MinIO
- Tela de dashboard com CRUD visual completo de links
- Integracao Stripe Checkout + Webhook para ciclo de assinatura

## Qualidade e testes

- Testes unitarios e de integracao com Vitest
- E2E com Cypress para fluxos criticos
- Fluxo de desenvolvimento obrigatorio em TDD

## Decisao sobre Prisma Client gerado

- `src/generated` nao deve ser commitado
- O cliente e gerado via `npm run prisma:generate` em ambiente local e CI
