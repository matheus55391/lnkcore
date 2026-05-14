# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# prisma.config.ts usa env("DATABASE_URL") estritamente — mesmo no generate.
# Fornece uma URL dummy só para este step; não vai para a imagem final.
ENV DATABASE_URL=postgresql://build:build@build:5432/build

# Generate Prisma client (custom output: src/generated/prisma)
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Remove dev dependencies to keep final image lean
RUN npm prune --production

# ── Stage 2: Production runner ────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Runtime dependencies
COPY --from=builder /app/node_modules        ./node_modules
COPY --from=builder /app/.next               ./.next
COPY --from=builder /app/public              ./public
COPY --from=builder /app/package*.json       ./
COPY --from=builder /app/next.config.ts      ./

# Prisma: migrations (needed for `prisma migrate deploy` at startup)
COPY --from=builder /app/prisma              ./prisma
COPY --from=builder /app/prisma.config.ts    ./prisma.config.ts

# Generated Prisma client (custom output path: src/generated/prisma)
COPY --from=builder /app/src/generated       ./src/generated

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --spider -q http://localhost:3000 || exit 1

# Run DB migrations then start the production server
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && npm start"]
