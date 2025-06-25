# Use uma imagem base Node.js
FROM node:20-alpine AS base

# Instale as dependências
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else npm ci; \
  fi

# Construa a aplicação Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
# Gere o cliente Prisma antes do build do Next.js
RUN npx prisma generate
RUN npm run build

# Imagem de produção
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Descomente a linha abaixo caso queira desabilitar a telemetria em tempo de execução.
ENV NEXT_TELEMETRY_DISABLED 1

# Crie um usuário e grupo não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie os arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules # Certifique-se de copiar node_modules para o runtime
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma # Copie a pasta prisma para o runtime

# Defina as permissões corretas
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponha a porta em que o Next.js é executado
EXPOSE 3000

# Comando para executar a aplicação
CMD ["node", "server.js"]
