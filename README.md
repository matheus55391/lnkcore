# lnkcore

SaaS no estilo Linktree, desenvolvido em **um unico projeto Next.js App Router** (fullstack).

## Documento principal

- Arquitetura e escopo MVP: `docs/MVP-ARQUITETURA.md`
- Regras de desenvolvimento: `docs/DEVELOPMENT-RULES.md`
- Estrategia de testes: `docs/TESTING-STRATEGY.md`
- Arquitetura de pastas: `docs/ARCHITECTURE.md`

## Ambiente local (Docker)

1. Copie as variaveis:

```bash
cp .env.example .env
```

2. Suba os servicos:

```bash
npm run db:up
```

3. Gere Prisma Client e aplique migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Rode a aplicacao:

```bash
npm run dev
```

## Scripts principais

- `npm run dev`: inicia o app Next.js
- `npm run db:up`: sobe Postgres e MinIO
- `npm run db:down`: encerra servicos Docker
- `npm run prisma:generate`: gera Prisma Client
- `npm run prisma:migrate`: cria/aplica migration local
- `npm run prisma:studio`: abre Prisma Studio
- `npm run lint`: verifica padrao de codigo
- `npm run format`: formata com Biome
- `npm run test`: roda unit + integration (Vitest)
- `npm run test:e2e`: roda e2e com Cypress

## Rotas MVP

- `/register` e `/login`
- `/dashboard`
- `/dashboard/billing`
- `/[slug]`
- `/api/auth/*`
- `/api/dashboard/*`
