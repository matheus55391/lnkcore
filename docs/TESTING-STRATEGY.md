# Estratégia de Testes

## Objetivo

Garantir confiabilidade da base SaaS com cobertura em:

- regras de negocio;
- validacoes;
- utilitarios;
- rotas criticas de integracao;
- fluxos e2e essenciais.

## Piramide adotada

- **Unit (Vitest)**: foco principal.
- **Integration (Vitest)**: handlers e orquestracao.
- **E2E (Cypress)**: fluxos criticos de usuario.

## Unit e Integration (Vitest)

Cobertura minima esperada:

- `src/modules/**/service*`
- `src/schemas/**`
- `src/lib/**` (utils e infra helper)
- `src/app/api/**` (integration tests de rotas criticas)

Comandos:

- `npm run test:unit`
- `npm run test:integration`
- `npm run test`

## E2E (Cypress)

Fluxos alvo:

- cadastro;
- login;
- dashboard;
- edicao de page;
- pagina publica por slug;
- assinatura Stripe.

Comandos:

- `npm run test:e2e`
- `npm run test:e2e:open`
- `npm run test:e2e:ci`

## Regra de PR

Nenhuma feature de dominio deve ser mergeada sem:

1. testes unitarios da regra nova;
2. atualizacao ou adicao de teste de integracao quando houver endpoint;
3. ajuste de spec e2e quando o fluxo do usuario for alterado.
