# Arquitetura

## Stack

| Camada | Tecnologia | Versão |
| ------ | ---------- | ------ |
| Framework | Next.js (App Router) | 16 |
| Linguagem | TypeScript | 5 |
| Runtime UI | React | 19 |
| Autenticação | Better Auth | 1.x |
| ORM | Prisma | 7 |
| Driver Postgres | `@prisma/adapter-pg` | 7 |
| Banco de dados | PostgreSQL | 16 |
| Object storage | MinIO (S3-compatible) | latest |
| Estilo | Tailwind CSS | v4 |
| Componentes | Radix UI primitives | — |
| Formulários | react-hook-form + zod | — |

## Estrutura de pastas

```
lnkcore/
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   └── migrations/           # Histórico de migrações
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout (fonte, body)
│   │   ├── page.tsx          # Landing page pública
│   │   ├── globals.css       # Estilos globais (Tailwind v4)
│   │   │
│   │   ├── (auth)/           # Grupo de rotas de autenticação
│   │   │   ├── layout.tsx    # Layout centrado + redirect se já logado
│   │   │   ├── sign-in/page.tsx
│   │   │   └── sign-up/page.tsx
│   │   │
│   │   ├── api/
│   │   │   └── auth/[...all]/route.ts  # Handler Better Auth
│   │   │
│   │   └── dashboard/
│   │       └── page.tsx      # Área protegida (requer sessão)
│   │
│   ├── components/
│   │   ├── auth/             # sign-in-form, sign-up-form, sign-out-button
│   │   └── ui/               # button, card, input, label (Radix + CVA)
│   │
│   ├── generated/
│   │   └── prisma/           # Cliente Prisma gerado (gitignored)
│   │
│   ├── lib/
│   │   ├── auth.ts           # Instância do Better Auth (server)
│   │   ├── auth-client.ts    # Instância do auth client (browser)
│   │   ├── prisma.ts         # Singleton do PrismaClient
│   │   └── utils.ts          # Utilitários (cn helper)
│   │
│   ├── schemas/
│   │   └── auth.ts           # Schemas zod para sign-in e sign-up
│   │
│   └── proxy.ts              # Middleware de proteção de rotas
│
├── docker-compose.yml        # PostgreSQL + MinIO para dev local
├── .env.example              # Template de variáveis de ambiente
├── next.config.ts
├── prisma.config.ts
└── tsconfig.json
```

## Fluxo de requisição

```
Browser
  │
  ├── GET /                   → Landing page (público)
  ├── GET /sign-in            → AuthLayout + SignInForm
  ├── GET /sign-up            → AuthLayout + SignUpForm
  │
  ├── POST /api/auth/...      → Better Auth handler (cookies httpOnly)
  │
  └── GET /dashboard
        │
        proxy.ts (middleware)
        ├── sem sessão  → redirect /sign-in
        └── com sessão  → DashboardPage (SSR, valida sessão novamente)
```

## Decisões de design

### Middleware leve (`proxy.ts`)
O middleware verifica apenas a **presença** do cookie de sessão (`better-auth` via `getSessionCookie`). A validação completa acontece no Server Component (`auth.api.getSession`) para evitar consultas desnecessárias ao banco em cada requisição.

### Prisma com driver nativo (`@prisma/adapter-pg`)
Permite usar o driver `pg` diretamente, habilitando suporte a edge runtimes e melhor compatibilidade com deploy em ambientes serverless no futuro.

### Client Prisma gerado localmente
O cliente é gerado em `src/generated/prisma` (gitignored) para manter o repositório limpo e evitar conflitos entre ambientes com arquiteturas diferentes.
