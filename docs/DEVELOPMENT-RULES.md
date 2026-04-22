# Regras de Desenvolvimento

## Stack e escopo

- Projeto unico em Next.js App Router + TypeScript.
- Proibido monorepo, NestJS e Vite neste repositorio.
- Arquitetura modular com separacao clara entre `modules`, `lib`, `schemas` e `app`.

## Fluxo obrigatorio: TDD

Toda entrega deve seguir:

1. **Red**: escrever testes primeiro e validar falha.
2. **Green**: implementar o minimo necessario para testes passarem.
3. **Refactor**: melhorar legibilidade/estrutura sem quebrar testes.

Nao implementar regra de negocio sem teste cobrindo o comportamento.

## Padrões de código

- Validacao de entrada com Zod em boundary (`api`, `actions`, `services`).
- `services` contem regra de negocio; componentes nao devem concentrar logica de dominio.
- Sempre checar ownership em operacoes de dashboard.
- Sanitizacao server-side para URLs e dados externos.
- Evitar arquivos grandes: quebrar por responsabilidade.

## Service layer

- Funcoes pequenas e deterministicas.
- Um service por responsabilidade principal.
- Erros de dominio com mensagens claras para uso em API.
- Dependencias de infra centralizadas em `src/lib`.

## Prisma Client no repositorio

Decisao: **nao commitar `src/generated`**.

Motivos:

- evita divergencia de artefato gerado entre ambientes;
- reduz ruido de diff em PR;
- CI/CD gera cliente de forma deterministica com `npm run prisma:generate`.

Obrigatorio em CI:

1. `npm ci`
2. `npm run prisma:generate`
3. `npm run build`
