# lnkcore

Link-in-bio platform built with Next.js 16 (App Router), Better Auth, Prisma 7, PostgreSQL and Stripe.

> ⚠️ This project uses **Next.js 16**. APIs, conventions and file layout may differ from older Next.js versions — see [AGENTS.md](AGENTS.md).

## Tech Stack

- [Next.js 16](https://nextjs.org) — React 19, App Router
- [Better Auth](https://www.better-auth.com) — email/password auth with session cookies
- [Prisma 7](https://www.prisma.io) + [`@prisma/adapter-pg`](https://www.npmjs.com/package/@prisma/adapter-pg)
- [PostgreSQL 16](https://www.postgresql.org) (via Docker)
- [TanStack Query](https://tanstack.com/query/latest) — client-side data fetching and cache
- [Stripe](https://stripe.com) — subscriptions (FREE/PRO)
- [MinIO](https://min.io) — S3-compatible object storage (via Docker)
- [Tailwind CSS v4](https://tailwindcss.com) + Radix UI primitives
- [`react-hook-form`](https://react-hook-form.com) + [`zod`](https://zod.dev)

## Project Structure

```
prisma/              Prisma schema & migrations
src/
  app/               Next.js App Router (routes, layouts)
    (auth)/          sign-in / sign-up routes
    (dashboard)/     private client routes (TanStack Query)
    [slug]/          public page (SSR)
    api/auth/        Better Auth handler
    api/stripe/      Stripe webhook
  actions/           Server Actions split by function
  components/        UI + feature components
  hooks/             React Query hooks (use-pages, use-links)
  generated/prisma/  Generated Prisma client (gitignored)
  lib/               auth, auth-client, prisma, stripe, plan, query-provider
  utils/             server utils (session)
  schemas/           zod schemas
  @types/            app DTOs and action result types
  proxy.ts           route protection (middleware)
docker-compose.yml   Postgres + MinIO for local dev
.env.example         Template for environment variables
```

## Requirements

- Node.js ≥ 20
- npm (or pnpm / yarn / bun)
- Docker + Docker Compose (for local Postgres & MinIO)

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/matheus55391/lnkcore.git
cd lnkcore
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env` — at minimum generate a strong `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

See [Environment Variables](#environment-variables) below for each variable.

### 3. Start the infrastructure

```bash
docker compose up -d
```

This starts:

| Service  | Port(s)      | Default credentials      |
| -------- | ------------ | ------------------------ |
| Postgres | `5432`       | `lnkcore` / `lnkcore`    |
| MinIO    | `9000` (API) | `lnkcore` / `lnkcore123` |
| MinIO UI | `9001`       | `lnkcore` / `lnkcore123` |

MinIO console: <http://localhost:9001>

### 4. Apply database migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

> The Prisma client is generated to `src/generated/prisma` (gitignored).

### 5. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

- `/` — public landing
- `/sign-up` — account creation
- `/sign-in` — login
- `/dashboard` — private dashboard (pages)
- `/dashboard/[pageId]` — page details and links management
- `/[slug]` — public link-in-bio page

### 6. (Optional) Configure Stripe locally

```bash
npm run stripe:login
npm run stripe:listen
```

Copy the `whsec_...` value from Stripe CLI into `STRIPE_WEBHOOK_SECRET`.

### 7. Local setup with Stripe (recommended end-to-end check)

1. Create the PRO product and recurring monthly price in Stripe Dashboard (sandbox/test mode).
2. Set `STRIPE_SECRET_KEY` and `STRIPE_PRO_PRICE_ID` in `.env`.
3. Start listener with `npm run stripe:listen` and copy `whsec_...` to `STRIPE_WEBHOOK_SECRET`.
4. Run the app with `npm run dev`.
5. Click Upgrade PRO in dashboard and complete checkout with test card `4242 4242 4242 4242`.
6. Confirm webhook received (`checkout.session.completed`) and user plan updated to `PRO`.

## Scripts

| Script          | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start Next.js in development mode |
| `npm run build` | Production build                  |
| `npm start`     | Start the production server       |
| `npm run lint`  | Run ESLint                        |
| `npm run stripe:login` | Authenticate Stripe CLI in your test account |
| `npm run stripe:listen` | Forward Stripe events to local webhook endpoint |
| `npm run stripe:trigger:checkout` | Trigger `checkout.session.completed` test event |
| `npm run stripe:trigger:subscription:update` | Trigger `customer.subscription.updated` test event |
| `npm run stripe:trigger:subscription:delete` | Trigger `customer.subscription.deleted` test event |

## Environment Variables

See [.env.example](.env.example) for the full template. Summary:

| Variable                      | Required | Description                                                    |
| ----------------------------- | :------: | -------------------------------------------------------------- |
| `DATABASE_URL`                |    ✅    | Postgres connection string used by Prisma.                     |
| `BETTER_AUTH_SECRET`          |    ✅    | Secret used to sign auth cookies / tokens. Must be ≥ 32 chars. |
| `BETTER_AUTH_URL`             |    ✅    | Public base URL of the app (no trailing slash).                |
| `NEXT_PUBLIC_BETTER_AUTH_URL` |    ❌    | Optional — exposes the base URL to the browser auth client.    |
| `STRIPE_SECRET_KEY`           |    ✅*   | Stripe secret key (`sk_test_...`/`sk_live_...`).              |
| `STRIPE_PRO_PRICE_ID`         |    ✅*   | Price ID do plano PRO (`price_...`).                          |
| `STRIPE_WEBHOOK_SECRET`       |    ✅*   | Webhook secret for `/api/stripe/webhook` (`whsec_...`).       |
| `S3_ENDPOINT`                 |    ❌    | S3 / MinIO endpoint URL (quando storage estiver implementado). |
| `S3_REGION`                   |    ❌    | S3 region (use `us-east-1` for MinIO).                         |
| `S3_ACCESS_KEY`               |    ❌    | S3 access key.                                                 |
| `S3_SECRET_KEY`               |    ❌    | S3 secret key.                                                 |
| `S3_BUCKET`                   |    ❌    | Default bucket name.                                           |
| `S3_FORCE_PATH_STYLE`         |    ❌    | `true` for MinIO / non-AWS providers; `false` on real AWS S3. |

`*` Obrigatória para o fluxo de billing (upgrade PRO).

## Authentication

Authentication is powered by [Better Auth](https://www.better-auth.com) with the Prisma adapter. The default configuration (see [src/lib/auth.ts](src/lib/auth.ts)) enables:

- Email + password with auto sign-in after sign-up
- Minimum password length of 8 characters
- 7-day sessions with a 5-minute cookie cache
- `httpOnly` / `sameSite=lax` cookies, `secure` in production

Routes under `/dashboard` are gated by [src/proxy.ts](src/proxy.ts), which redirects unauthenticated requests to `/sign-in`.

The auth HTTP handler lives at [src/app/api/auth/\[...all\]/route.ts](src/app/api/auth/%5B...all%5D/route.ts).

## Database

Schema: [prisma/schema.prisma](prisma/schema.prisma). Common workflows:

```bash
# Create a new migration from schema changes
npx prisma migrate dev --name <change>

# Apply pending migrations (CI / prod)
npx prisma migrate deploy

# Regenerate the client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Deployment

The app can be deployed to any Node.js-capable host. On managed platforms (Vercel, Fly.io, Railway, ...) make sure to:

1. Provision a PostgreSQL database and set `DATABASE_URL`.
2. Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` to production values.
3. Configure Stripe (`STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`) and create a webhook endpoint for `/api/stripe/webhook`.
4. (Optional) Provision an S3-compatible bucket and set `S3_*` variables.
5. Run `prisma migrate deploy` as part of the release step.

## License

TBD
