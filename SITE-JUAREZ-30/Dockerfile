# Stage 1: Builder
FROM node:18-alpine AS builder

ARG GREEN='\033[0;32m'
ARG YELLOW='\033[1;33m'
ARG BLUE='\033[0;34m'
ARG RED='\033[0;31m'
ARG NC='\033[0m'

RUN echo -e "${BLUE}========================================${NC}" && \
    echo -e "${BLUE}🚀 INICIANDO FASE DE BUILD - SIQUEIRA CAMPOS IMÓVEIS${NC}" && \
    echo -e "${BLUE}========================================${NC}"

WORKDIR /app

COPY . .

ARG SKIP_DB=true
ENV SKIP_DB=${SKIP_DB}

RUN echo -e "${YELLOW}Instalando dependências do sistema...${NC}" && \
    apk add --no-cache curl iputils-ping yarn git python3 make g++ openssl && \
    echo -e "${GREEN}✅ Dependências do sistema instaladas!${NC}"

RUN echo -e "${YELLOW}Removendo arquivos de lock...${NC}" && \
    rm -f yarn.lock package-lock.json pnpm-lock.yaml && \
    echo -e "${YELLOW}Limpando cache do Yarn...${NC}" && \
    yarn cache clean

RUN echo -e "${YELLOW}Instalando dependências com Yarn...${NC}" && \
    NODE_OPTIONS="--max_old_space_size=4096" yarn install --network-timeout 100000 || \
    (echo -e "${RED}❌ ERRO: Falha no yarn install${NC}" && exit 1)

RUN echo -e "${GREEN}✅ Dependências instaladas!${NC}" && \
    echo ""

ENV DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"

RUN if [ "$SKIP_DB" = "true" ]; then \
      echo -e "${YELLOW}Pulando build do Next.js por SKIP_DB=true${NC}"; \
    else \
      echo -e "${YELLOW}📋 Iniciando build do Next.js...${NC}" && \
      yarn build && \
      echo -e "${GREEN}✅ Build concluído com sucesso!${NC}" && \
      echo -e "${BLUE}BUILD COMPLETO!${NC}" && \
      echo ""; \
    fi

# Stage 2: Runner
FROM node:18-alpine AS runner

RUN echo -e "${GREEN}========================================${NC}" && \
    echo -e "${GREEN}  Preparando para Iniciar o Aplicativo  \033[0m" && \
    echo -e "${GREEN}========================================${NC}"

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/start.sh ./start.sh
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env.production ./.env.production

EXPOSE 3000

CMD ["/bin/sh", "start.sh"]
