# Deployment — lnkcore

Guia completo para subir o lnkcore em uma VPS Linux (Ubuntu 22.04/24.04) via Docker + GitHub Actions.

## Visão geral do fluxo

```
push → main
  └─► GitHub Actions
        ├─ 1. docker build (sem ARGs — todas as vars são server-side)
        ├─ 2. docker push → Docker Hub (lnkcore:latest)
        └─ 3. SSH na VPS
               ├─ docker pull lnkcore:latest
               ├─ docker compose up -d  (app + postgres)
               └─ prisma migrate deploy (roda automaticamente no startup)
```

**Por que não há `ARG`s no build?**
Diferente de projetos com `NEXT_PUBLIC_*`, todas as variáveis do lnkcore são server-side. A imagem é genérica e os segredos são injetados **em runtime** via docker-compose.

---

## Simular produção localmente

Antes de fazer o primeiro deploy na VPS, valide a imagem de produção na sua máquina.

### Pré-requisito: criar `.env.prod.local`

```bash
cp .env.example .env.prod.local
```

Ajuste os valores mínimos no `.env.prod.local`:

```env
# Docker — build local
DOCKER_IMAGE=lnkcore
IMAGE_TAG=local

# Porta exposta no host
APP_HOST=0.0.0.0
APP_PORT=3000

# Banco — host deve ser o nome do serviço Docker
POSTGRES_PASSWORD=lnkcore
DATABASE_URL=postgresql://lnkcore:lnkcore@lnkcore-postgres:5432/lnkcore?schema=public

# Better Auth
BETTER_AUTH_SECRET=local-test-secret-minimum-32-characters!!
BETTER_AUTH_URL=http://localhost:3000

# Stripe (test keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# MinIO (simula S3/R2 — S3_ENDPOINT usa o nome do serviço interno)
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=lnkcore
S3_SECRET_KEY=lnkcore123
S3_BUCKET=lnkcore
S3_FORCE_PATH_STYLE=true
S3_PUBLIC_URL=http://localhost:9000
```

### Subir o stack local

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod.local --profile local up --build -d
```

O `--profile local` ativa o MinIO. Na VPS (sem o profile) só sobem `app` + `postgres`.

| Serviço | URL |
|---|---|
| App | http://localhost:3000 |
| MinIO Console | http://localhost:9001 (user: `lnkcore` / pass: `lnkcore123`) |

### Verificar logs

```bash
docker logs -f lnkcore-app
```

Output esperado:
```
No pending migrations to apply.
▲ Next.js 16.2.4
✓ Ready in 55ms
```

### Derrubar o stack local

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod.local --profile local down
```

> `.env.prod.local` já é ignorado pelo `.gitignore` (regra `.env*`).

---

## Pré-requisitos (VPS)

| Item | Onde conseguir |
|---|---|
| VPS Ubuntu 22.04+ | Hostinger, DigitalOcean, Hetzner |
| Domínio apontando para o IP da VPS | Registro.br, Cloudflare |
| Conta Docker Hub | hub.docker.com |
| Conta Stripe (live keys) | dashboard.stripe.com |
| Cloudflare R2 (armazenamento) | dash.cloudflare.com → R2 |

---

## 1. Configurar a VPS

Instale Docker, nginx, certbot, UFW e fail2ban. Configure nginx como reverse proxy para `127.0.0.1:3000` e obtenha SSL com Let's Encrypt. Crie um usuário `deploy` sem root, adicionado ao grupo `docker`, e clone o repositório em `/home/deploy/lnkcore`.

---

## 2. Configurar o `.env` na VPS

Após o setup, edite o arquivo:

```bash
nano /home/deploy/lnkcore/.env
```

Conteúdo completo esperado:

```env
# Docker
IMAGE_TAG=latest
DOCKER_IMAGE=SEU_DOCKERHUB_USER/lnkcore

# PostgreSQL (roda dentro do Docker na mesma rede)
POSTGRES_DB=lnkcore
POSTGRES_USER=lnkcore
POSTGRES_PASSWORD=senha-forte-gerada-pelo-setup

# A URL usa o nome do serviço Docker como host
DATABASE_URL=postgresql://lnkcore:senha-forte@lnkcore-postgres:5432/lnkcore?schema=public

# Better Auth
BETTER_AUTH_SECRET=string-aleatoria-min-32-chars   # openssl rand -base64 32
BETTER_AUTH_URL=https://seu-dominio.com.br

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Cloudflare R2 (recomendado para produção)
S3_ENDPOINT=https://SEU_ACCOUNT_ID.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY=chave-r2
S3_SECRET_KEY=segredo-r2
S3_BUCKET=lnkcore
S3_FORCE_PATH_STYLE=false
S3_PUBLIC_URL=https://pub-SEU_ID.r2.dev
```

> **Permissão:** `chmod 600 /home/deploy/lnkcore/.env`

---

## 3. Configurar chave SSH para o GitHub Actions

Na sua máquina local:

```bash
# Gerar par de chaves exclusivo para o deploy
ssh-keygen -t ed25519 -C "github-actions-lnkcore" -f ~/.ssh/lnkcore_deploy -N ""

# Adicionar chave pública na VPS
cat ~/.ssh/lnkcore_deploy.pub | ssh root@IP_DA_VPS \
  "cat >> /home/deploy/.ssh/authorized_keys"

# Verificar acesso
ssh -i ~/.ssh/lnkcore_deploy deploy@IP_DA_VPS "echo OK"
```

---

## 4. Configurar GitHub Actions

### 4.1 Secrets do repositório

Acesse: **Repositório → Settings → Secrets and variables → Actions**

| Secret | Valor |
|---|---|
| `DOCKER_USERNAME` | Seu usuário do Docker Hub |
| `DOCKER_PASSWORD` | Token do Docker Hub (não a senha) |
| `SSH_PRIVATE_KEY` | Conteúdo de `~/.ssh/lnkcore_deploy` |
| `SERVER_HOST` | `deploy@IP_DA_VPS` |

### 4.2 Criar ambiente `production`

**Settings → Environments → New environment → `production`**

Adicione proteção de branch: só a `main` pode fazer deploy neste ambiente.

### 4.3 Como criar o token do Docker Hub

Docker Hub → Account Settings → Security → **New Access Token** → permissão `Read & Write`.

---

## 5. Primeiro deploy manual

Antes do GitHub Actions, suba pela primeira vez manualmente para verificar que tudo funciona:

```bash
# Na VPS, como usuário deploy
cd ~/lnkcore

docker login -u SEU_USER
docker compose -f docker-compose.prod.yml --env-file .env up -d
docker logs -f lnkcore-app
```

O output esperado:
```
Prisma schema loaded from prisma/schema.prisma
No pending migrations.   ← ou: Applied N migration(s)
▲ Next.js 16.x
✓ Ready in 2.1s
```

---

## 6. Stripe Webhook na produção

1. Acesse [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint** → `https://seu-dominio.com.br/api/stripe/webhook`
3. Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copie o **Signing secret** → `STRIPE_WEBHOOK_SECRET` no `.env`
5. `docker restart lnkcore-app`

---

## 7. Deploy contínuo (após configuração)

```bash
git push origin main   # build + deploy automático via GitHub Actions
```

Tempo médio: **~3-4 min** (com cache: ~1-2 min).

---

## 8. Comandos úteis na VPS

```bash
# Status
docker compose -f ~/lnkcore/docker-compose.prod.yml ps

# Logs em tempo real
docker logs -f lnkcore-app

# Restart apenas do app
docker restart lnkcore-app

# Migrations manuais
docker exec lnkcore-app node_modules/.bin/prisma migrate deploy

# Backup do banco
docker exec lnkcore-postgres pg_dump -U lnkcore lnkcore > backup_$(date +%Y%m%d).sql

# Liberar disco
docker image prune -f
```

---

## 9. Renovação SSL

O certbot renova automaticamente. Para renovar manualmente:

```bash
certbot renew --dry-run && certbot renew
```

---

## Referência de variáveis de ambiente

O lnkcore não usa `NEXT_PUBLIC_*` — todas as variáveis são server-side e injetadas em runtime pelo docker-compose:

| Variável | Obrigatória | Descrição |
|---|:-:|---|
| `DATABASE_URL` | ✅ | Connection string PostgreSQL. Host = `lnkcore-postgres` (nome do serviço Docker) |
| `POSTGRES_PASSWORD` | ✅ | Senha do banco (usada pelo container postgres) |
| `BETTER_AUTH_SECRET` | ✅ | Secret ≥ 32 chars — `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | ✅ | URL pública do app — `https://seu-dominio.com.br` |
| `STRIPE_SECRET_KEY` | ✅ | Chave secreta do Stripe (`sk_live_...`) |
| `STRIPE_PRO_PRICE_ID` | ✅ | Price ID do plano PRO |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Secret do webhook (`whsec_...`) |
| `S3_ENDPOINT` | ✅ | Endpoint Cloudflare R2 ou AWS S3 |
| `S3_REGION` | ✅ | Região (`auto` para R2) |
| `S3_ACCESS_KEY` | ✅ | Access key do bucket |
| `S3_SECRET_KEY` | ✅ | Secret key do bucket |
| `S3_BUCKET` | ✅ | Nome do bucket |
| `S3_FORCE_PATH_STYLE` | ✅ | `false` para R2/AWS; `true` para MinIO local |
| `S3_PUBLIC_URL` | ✅ | URL pública de leitura dos arquivos |
| `DOCKER_IMAGE` | ✅ | Nome da imagem no Docker Hub (`user/lnkcore`) |
| `IMAGE_TAG` | ✅ | Tag da imagem (`latest`) |
