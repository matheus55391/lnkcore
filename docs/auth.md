# Autenticação

O lnkcore usa [Better Auth](https://www.better-auth.com) com o adaptador Prisma para gerenciar autenticação e sessões.

## Configuração do servidor

Arquivo: `src/lib/auth.ts`

```ts
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,     // loga automaticamente após sign-up
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // envia email via SMTP (Mailpit em dev) — ver src/lib/email.ts
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,   // 7 dias
    updateAge:  60 * 60 * 24,       // renova cookie a cada 1 dia
    cookieCache: { enabled: true, maxAge: 60 * 5 }, // 5 min
  },
  plugins: [nextCookies()],         // integração com cookies do Next.js
});
```

## Client (browser)

Arquivo: `src/lib/auth-client.ts`

Exporta hooks e funções para uso em Client Components:

| Export | Uso |
| ------ | --- |
| `signIn(email, password)` | Autentica o usuário |
| `signUp(name, email, password)` | Cria conta e loga |
| `signOut()` | Encerra a sessão |
| `requestPasswordReset({ email, redirectTo })` | Solicita link de recuperação |
| `resetPassword({ newPassword, token })` | Define nova senha com token do email |
| `useSession()` | Hook React com dados da sessão atual |
| `getSession()` | Versão assíncrona sem hook |

## Validação de formulários

Arquivo: `src/schemas/auth.ts`

Os formulários usam `react-hook-form` + `zod`:

| Schema | Campos | Regras |
| ------ | ------ | ------ |
| `signUpSchema` | `name`, `email`, `password`, `confirmPassword` | nome ≥ 2 chars, email válido, senha ≥ 8 chars, senhas iguais |
| `signInSchema` | `email`, `password` | email válido, senha não vazia |
| `forgotPasswordSchema` | `email` | email válido |
| `resetPasswordSchema` | `password`, `confirmPassword` | senha ≥ 8 chars, senhas iguais |

## Handler HTTP

Arquivo: `src/app/api/auth/[...all]/route.ts`

O Better Auth captura **todas** as requisições em `/api/auth/*` (sign-in, sign-up, sign-out, get-session, etc.). Não é necessário criar endpoints manualmente.

### Endpoints gerados automaticamente

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| `POST` | `/api/auth/sign-up/email` | Cadastro |
| `POST` | `/api/auth/sign-in/email` | Login |
| `POST` | `/api/auth/sign-out` | Logout |
| `GET`  | `/api/auth/get-session` | Dados da sessão atual |

## Proteção de rotas

### Middleware (`src/proxy.ts`)

Executado na **edge** para cada requisição em `/dashboard/*`. Verifica a presença do cookie de sessão de forma leve (sem consultar o banco):

```ts
const sessionCookie = getSessionCookie(request);
if (!sessionCookie) {
  return NextResponse.redirect(new URL("/sign-in", request.url));
}
```

### Server Component / Server Action

A validação real da sessão fica centralizada em [src/utils/session.ts](../src/utils/session.ts):

```ts
import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "@/lib/auth";

export async function getSession(): Promise<Session | null> {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}
```

Uso típico:

```ts
// Em um layout de área privada
const session = await getSession();
if (!session) redirect("/sign-in");

// Em uma Server Action
const session = await requireSession();
// ...opera em nome de session.user.id
```

A dupla verificação (middleware + server) garante segurança mesmo que o cookie exista mas a sessão tenha expirado.

### Layout de autenticação (`src/app/(auth)/layout.tsx`)

Redireciona para `/dashboard` se o usuário **já estiver** logado, evitando que acesse `/sign-in` ou `/sign-up` desnecessariamente.

## Cookies de sessão

| Atributo | Valor |
| -------- | ----- |
| `httpOnly` | `true` |
| `sameSite` | `lax` |
| `secure` | `true` em produção, `false` em dev |
| `path` | `/` |

## Recuperação de senha

Fluxo integrado ao Better Auth:

1. Usuário acessa `/forgot-password` e informa o email.
2. `POST /api/auth/request-password-reset` envia o email com link.
3. O link redireciona para `/reset-password?token=...`.
4. `POST /api/auth/reset-password` grava a nova senha.

### SMTP local (desenvolvimento)

O `docker-compose.yml` sobe o [Mailpit](https://mailpit.axllent.org) na porta `1025` (SMTP) e `8025` (interface web). Variáveis no `.env`:

| Variável | Valor local |
| -------- | ----------- |
| `SMTP_HOST` | `localhost` |
| `SMTP_PORT` | `1025` |
| `SMTP_FROM` | `makebio <no-reply@makebio.local>` |

> O **MinIO** no mesmo compose é apenas para armazenamento S3 (imagens/arquivos), não para email.

## Configuração futura: provedores sociais

O objeto `socialProviders: {}` em `src/lib/auth.ts` está pronto para receber integrações com GitHub, Google, etc. Basta adicionar as chaves correspondentes e as variáveis de ambiente (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, etc.).
