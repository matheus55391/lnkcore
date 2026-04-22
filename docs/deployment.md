# Deploy

O lnkcore é uma aplicação Next.js 16 padrão e pode ser implantada em qualquer plataforma com suporte a Node.js.

## Variáveis de ambiente

Configure todas as variáveis abaixo no painel da plataforma de deploy:

| Variável | Obrigatória | Descrição |
| -------- | :---------: | --------- |
| `DATABASE_URL` | ✅ | Connection string do PostgreSQL de produção |
| `BETTER_AUTH_SECRET` | ✅ | Secret ≥ 32 chars. Gere com `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | ✅ | URL pública do app em produção (ex: `https://lnkcore.com`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | ❌ | Opcional — expõe a URL base ao cliente. Se ausente, usa `window.location.origin` |
| `S3_ENDPOINT` | ✅ | Endpoint do bucket S3 (ex: `https://<id>.r2.cloudflarestorage.com`) |
| `S3_REGION` | ✅ | Região S3 (ex: `us-east-1` ou `auto` para R2) |
| `S3_ACCESS_KEY` | ✅ | Access key do bucket |
| `S3_SECRET_KEY` | ✅ | Secret key do bucket |
| `S3_BUCKET` | ✅ | Nome do bucket |
| `S3_FORCE_PATH_STYLE` | ✅ | `true` para MinIO/R2; `false` para AWS S3 |

---

## Checklist pré-deploy

- [ ] PostgreSQL provisionado e `DATABASE_URL` configurada
- [ ] Bucket S3 criado e variáveis `S3_*` configuradas
- [ ] `BETTER_AUTH_SECRET` gerado com `openssl rand -base64 32`
- [ ] `BETTER_AUTH_URL` apontando para o domínio de produção
- [ ] `npx prisma migrate deploy` executado no passo de release

---

## Plataformas gerenciadas

### Vercel (recomendado para Next.js)

1. Importe o repositório no [Vercel](https://vercel.com).
2. Adicione as variáveis de ambiente no painel do projeto.
3. Configure o **Build Command**: `npm run build`
4. Configure o **Install Command**: `npm install && npx prisma generate`
5. Adicione um **Post-deploy Hook** ou use o campo "Run after install":
   ```
   npx prisma migrate deploy
   ```

> O Vercel não tem suporte nativo a PostgreSQL — use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Neon](https://neon.tech), [Supabase](https://supabase.com) ou [Railway](https://railway.app).

### Railway

O Railway suporta PostgreSQL, Node.js e variáveis de ambiente de forma nativa.

1. Crie um projeto e adicione um serviço **PostgreSQL** — o Railway injeta `DATABASE_URL` automaticamente.
2. Adicione um serviço a partir do repositório GitHub.
3. Defina as variáveis de ambiente restantes.
4. No campo **Start Command**:
   ```bash
   npx prisma migrate deploy && npx prisma generate && npm run build && npm start
   ```

### Fly.io

1. `fly launch` na raiz do projeto.
2. Provisione um banco com `fly postgres create` e associe com `fly postgres attach`.
3. Defina as variáveis com `fly secrets set BETTER_AUTH_SECRET=... BETTER_AUTH_URL=...`.
4. No `Dockerfile` gerado, adicione antes do `CMD`:
   ```dockerfile
   RUN npx prisma generate
   CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
   ```

---

## Build manual (VPS / Docker)

```bash
# 1. Instalar dependências
npm ci

# 2. Gerar cliente Prisma
npx prisma generate

# 3. Aplicar migrações
npx prisma migrate deploy

# 4. Build de produção
npm run build

# 5. Iniciar
npm start
```

O servidor ouve na porta `3000` por padrão. Use um reverse proxy (Nginx / Caddy) na frente para TLS e domínio customizado.

---

## Cookies seguros em produção

O atributo `secure` dos cookies de sessão é habilitado automaticamente quando `NODE_ENV=production`. Certifique-se de que o domínio usa **HTTPS** — caso contrário, os cookies não serão enviados pelo browser.
