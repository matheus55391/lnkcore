# Getting Started

## Pré-requisitos

- **Node.js** ≥ 20 (`node -v`)
- **npm** ≥ 10 (ou pnpm / yarn / bun)
- **Docker** + **Docker Compose** v2 (`docker compose version`)

---

## 1. Clonar e instalar dependências

```bash
git clone https://github.com/matheus55391/lnkcore.git
cd lnkcore
npm install
```

---

## 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`. O único valor que **precisa** ser trocado antes de rodar é o `BETTER_AUTH_SECRET`:

```bash
# Gera uma string aleatória segura de 32+ chars
openssl rand -base64 32
```

Cole o resultado como valor de `BETTER_AUTH_SECRET` no `.env`.

> Veja a lista completa de variáveis em [.env.example](../.env.example) e a descrição de cada uma em [deployment.md](./deployment.md#variáveis-de-ambiente).

---

## 3. Subir a infraestrutura local

```bash
docker compose up -d
```

Isso inicia dois serviços:

| Serviço | Porta | Usuário | Senha |
| ------- | ----- | ------- | ----- |
| PostgreSQL 16 | `5432` | `lnkcore` | `lnkcore` |
| MinIO (API) | `9000` | `lnkcore` | `lnkcore123` |
| MinIO (Console) | `9001` | `lnkcore` | `lnkcore123` |

Verifique se os containers estão rodando:

```bash
docker compose ps
```

---

## 4. Aplicar migrações e gerar o cliente Prisma

```bash
# Aplica todas as migrações pendentes
npx prisma migrate deploy

# Gera o cliente em src/generated/prisma
npx prisma generate
```

> Em desenvolvimento, você pode usar `npx prisma migrate dev` para criar novas migrações interativamente.

---

## 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

- `/` — Landing page pública
- `/sign-up` — Criar conta
- `/sign-in` — Entrar
- `/dashboard` — Lista de páginas (privado)
- `/dashboard/[pageId]` — Gerenciar links de uma página
- `/[slug]` — Página pública de um usuário

---

## 6. (Opcional) Stripe em dev

Para testar o fluxo de upgrade PRO, instale a [Stripe CLI](https://stripe.com/docs/stripe-cli) e rode:

```bash
npm run stripe:login
npm run stripe:listen
```

Cole o `whsec_...` retornado no `.env` em `STRIPE_WEBHOOK_SECRET` e defina também `STRIPE_SECRET_KEY` e `STRIPE_PRO_PRICE_ID`. Detalhes em [billing.md](./billing.md).

### Checklist rápido para funcionar localmente

1. Produto PRO criado no Stripe Sandbox com preço recorrente mensal.
2. `STRIPE_SECRET_KEY` e `STRIPE_PRO_PRICE_ID` preenchidos no `.env`.
3. Listener ativo com `npm run stripe:listen`.
4. `STRIPE_WEBHOOK_SECRET` atualizado com o `whsec_...` da CLI.
5. App reiniciado após atualizar `.env`.

### Teste de eventos sem UI

```bash
npm run stripe:trigger:checkout
npm run stripe:trigger:subscription:update
npm run stripe:trigger:subscription:delete
```

---

## Scripts disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Servidor Next.js em modo desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção (requer build antes) |
| `npm run lint` | Executa o ESLint |
| `npm run stripe:login` | Autentica Stripe CLI na conta de teste |
| `npm run stripe:listen` | Encaminha eventos do Stripe para o webhook local |
| `npm run stripe:trigger:checkout` | Dispara evento de teste `checkout.session.completed` |
| `npm run stripe:trigger:subscription:update` | Dispara evento de teste `customer.subscription.updated` |
| `npm run stripe:trigger:subscription:delete` | Dispara evento de teste `customer.subscription.deleted` |
| `npx prisma studio` | Abre o Prisma Studio (GUI do banco) |
| `npx prisma migrate dev` | Cria e aplica nova migração |
| `npx prisma generate` | Regenera o cliente Prisma |

---

## Problemas comuns

### `DATABASE_URL` inválida / conexão recusada
Verifique se o container do PostgreSQL está rodando (`docker compose ps`) e se as credenciais no `.env` batem com as do `docker-compose.yml`.

### `BETTER_AUTH_SECRET` ausente ou curto demais
O Better Auth exige um secret de pelo menos 32 caracteres. Use `openssl rand -base64 32` para gerar um válido.

### Cliente Prisma desatualizado após mudança no schema
Sempre execute `npx prisma generate` após alterar `prisma/schema.prisma`.
