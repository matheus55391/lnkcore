# lnkcore — Documentação

Bem-vindo à documentação do **lnkcore**, uma plataforma de link-in-bio construída com Next.js 16, Better Auth, Prisma 7 e PostgreSQL.

## Índice

| Documento | Conteúdo |
| --------- | -------- |
| [Arquitetura](./architecture.md) | Stack, estrutura de pastas e fluxo geral da aplicação |
| [Getting Started](./getting-started.md) | Pré-requisitos, configuração do ambiente e execução local |
| [Autenticação](./auth.md) | Better Auth, fluxos de login/cadastro e proteção de rotas |
| [Banco de Dados](./database.md) | Schema Prisma, modelos e comandos de migração |
| [Storage](./storage.md) | Configuração do MinIO / S3 para arquivos e imagens |
| [Deploy](./deployment.md) | Guia de implantação em produção |

## Visão Geral

O lnkcore permite que usuários criem páginas públicas com múltiplos links (estilo Linktree). Cada usuário pode ter várias **Pages**, cada página possui um **slug** único e uma lista de **Links** ordenados.

```
Usuário
 └── Page (slug único, tema, bio)
      └── Link (título, URL, posição, ativo/inativo)
```

O produto está em fase inicial — o dashboard exibe a estrutura base e a área de criação/edição de páginas ainda está em desenvolvimento.
