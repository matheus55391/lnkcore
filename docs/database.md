# Banco de Dados

O lnkcore usa **PostgreSQL 16** com **Prisma 7** como ORM, via o driver nativo `@prisma/adapter-pg`.

## Schema

Arquivo: `prisma/schema.prisma`

### Modelos de autenticação (Better Auth)

Gerenciados automaticamente pelo Better Auth — não altere os campos marcados como obrigatórios pelo framework.

#### `User`

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| `id` | `String` PK | UUID gerado pelo Better Auth |
| `name` | `String` | Nome do usuário |
| `email` | `String` unique | Email |
| `emailVerified` | `Boolean` | Verificação de email (padrão: `false`) |
| `image` | `String?` | URL do avatar |
| `plan` | `Plan` | Plano de assinatura (`FREE` ou `PRO`) |
| `stripeCustomerId` | `String?` unique | ID do cliente no Stripe |
| `stripeSubscriptionId` | `String?` unique | ID da assinatura no Stripe |

#### `Session`

Sessões ativas. Cada sessão tem um `token` único e uma data de expiração (`expiresAt`).

#### `Account`

Contas OAuth vinculadas ao usuário (para provedores sociais futuros). Guarda `accessToken`, `refreshToken`, `providerId`, etc.

#### `Verification`

Tokens de verificação de email ou reset de senha, gerenciados pelo Better Auth.

---

### Modelos de domínio

#### `Plan` (enum)

```
FREE   — plano gratuito (padrão)
PRO    — plano pago
```

#### `PageLayout` (enum)

```
CLASSIC  — avatar redondo e links em botão (padrão)
COVER    — hero 4:5, identidade sobre a imagem
```

#### `LinkType` (enum)

```
CLASSIC   — botão compacto (padrão)
FEATURED  — card com overlay; altura em FeaturedSize
SOCIAL    — ícone na fileira de redes
```

#### `FeaturedSize` (enum)

```
COMPACT  — card 4:3 (padrão)
TALL     — card retrato 4:5
```

#### `Page`

Página pública em `makebio.com.br/{slug}`.

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| `id` | `String` PK cuid | ID único |
| `slug` | `String` unique | Identificador na URL |
| `title` | `String` | Título da página |
| `bio` | `String?` | Descrição/bio |
| `image` | `String?` | Avatar (Clássico) ou capa (Capa) |
| `published` | `Boolean` | Visível publicamente (padrão: `true`) |
| `themeId` | `Int` | Tema visual (padrão: `1` Air) |
| `layout` | `PageLayout` | `CLASSIC` ou `COVER` (padrão: `CLASSIC`) |
| `userId` | `String` FK | Dono da página |

Índice em `userId`.

#### `Link`

Um link pertencente a uma Page.

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| `id` | `String` PK cuid | ID único |
| `title` | `String` | Texto exibido |
| `url` | `String` | URL de destino |
| `image` | `String?` | Miniatura / foto do featured |
| `emoji` | `String?` | Emoji ou id de ícone |
| `type` | `LinkType` | `CLASSIC`, `FEATURED` ou `SOCIAL` |
| `featuredSize` | `FeaturedSize` | Altura do featured: `COMPACT` (4:3) ou `TALL` (4:5). Padrão `COMPACT`. Só vale quando `type` é `FEATURED`. |
| `active` | `Boolean` | Exibido na página pública (padrão: `true`) |
| `position` | `Int` | Ordem de exibição |
| `pageId` | `String` FK | Página à qual pertence |

Índice em `pageId`.

---

## Relações

```
User (1) ──── (N) Page
                    └── (N) Link

User (1) ──── (N) Session
User (1) ──── (N) Account
```

Todas as relações usam `onDelete: Cascade`, ou seja, deletar um `User` remove todas as suas `Page`s, `Session`s e `Account`s. Deletar uma `Page` remove todos os seus `Link`s.

---

## Comandos Prisma

```bash
# Criar uma nova migração (dev)
npx prisma migrate dev --name <nome-da-mudança>

# Aplicar migrações pendentes (CI / produção)
npx prisma migrate deploy

# Regenerar o cliente após mudar o schema
npx prisma generate

# Abrir o Prisma Studio (GUI)
npx prisma studio

# Inspecionar o banco e sincronizar o schema (sem migrations)
npx prisma db push
```

## Singleton do cliente

Arquivo: `src/lib/prisma.ts`

Em desenvolvimento, o `PrismaClient` é mantido em `globalThis` para evitar múltiplas instâncias causadas pelo hot-reload do Next.js. Em produção, uma instância nova é criada normalmente.

```ts
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```
