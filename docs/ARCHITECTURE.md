# Arquitetura de Pastas

## Estrutura atual

- `src/app`: rotas App Router e endpoints HTTP.
- `src/modules`: dominios e services.
- `src/lib`: infraestrutura compartilhada (prisma, auth, stripe, storage, utils).
- `src/schemas`: contratos de validacao com Zod.
- `docs`: regras, decisoes e guias de desenvolvimento.
- `agents`: regras e orientacoes para agentes.

## Organização por domínio

Cada dominio deve evoluir com:

- `service.ts`: regras de negocio;
- `*.test.ts`: testes unitarios da regra;
- `*.integration.test.ts`: quando houver orquestracao com rota;
- `ui-store.ts`: estado de UI local quando necessario.

## Rotas principais

- Publicas: `/`, `/[slug]`
- Auth: `/login`, `/register`, `/api/auth/[...all]`
- Dashboard: `/dashboard`, `/dashboard/billing`
- APIs de dashboard: `/api/dashboard/*`

## Decisões de design

- Sessao com Better Auth e cookie HttpOnly.
- App Router como unico backend/frontend runtime.
- Sem seed inicial obrigatoria para boot local.
- `Page` inicial autocriada sob demanda para usuario autenticado.
