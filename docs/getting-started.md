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
- `/dashboard` — Área protegida (requer login)

---

## Scripts disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Servidor Next.js em modo desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção (requer build antes) |
| `npm run lint` | Executa o ESLint |
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
