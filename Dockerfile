# Stage 1: Builder
FROM node:18-alpine AS builder

# Cores ANSI para o terminal
ARG GREEN='\033[0;32m'
ARG YELLOW='\033[1;33m'
ARG BLUE='\033[0;34m'
ARG RED='\033[0;31m'
ARG NC='\033[0m'

RUN echo -e "${BLUE}========================================${NC}" && \
    echo -e "${BLUE}🚀 INICIANDO FASE DE BUILD - SIQUEIRA CAMPOS IMÓVEIS${NC}" && \
    echo -e "${BLUE}========================================${NC}"

WORKDIR /app

COPY package*.json ./

# --- ETAPA DE INSTALAÇÃO DO YARN E FERRAMENTAS DE BUILD VIA APK ---
# Instala yarn e ferramentas de build essenciais para Alpine
RUN apk add --no-cache curl iputils-ping yarn git python3 make g++ && \
    echo -e "${GREEN}✅ Yarn e ferramentas de build instalados com sucesso via apk!${NC}"

# --- NOVAS ETAPAS: LIMPAR LOCKFILES E CACHE DO YARN ---
RUN echo -e "${YELLOW}Removendo arquivos de lock existentes (yarn.lock, package-lock.json, pnpm-lock.yaml)...${NC}" && \
    rm -f yarn.lock package-lock.json pnpm-lock.yaml && \
    echo -e "${YELLOW}Limpando cache do Yarn...${NC}" && \
    yarn cache clean

# --- ETAPA DE INSTALAÇÃO DE DEPENDÊNCIAS COM YARN (com mais memória) ---
RUN echo -e "${YELLOW}Instalando dependências com Yarn (com mais memória para o Node.js)...${NC}" && \
    # Aumenta o limite de memória para o processo do Node.js durante a instalação
    NODE_OPTIONS="--max_old_space_size=4096" yarn install --network-timeout 100000 || \
    (echo -e "${RED}ERRO CRÍTICO: Yarn install falhou. Verifique a rede, o registro e as dependências.${NC}" && exit 1)

RUN echo -e "${GREEN}✅ Dependências instaladas com sucesso com Yarn!${NC}" && \
    echo ""

# Etapa de Cópia de Arquivos e Build da Aplicação
RUN echo -e "${YELLOW}📋 Copiando arquivos do projeto e iniciando build do Next.js...${NC}"
COPY . .
RUN yarn build
RUN echo -e "${GREEN}✅ Build do Next.js concluído com sucesso!${NC}" && \
    echo -e "${BLUE}========================================${NC}" && \
    echo -e "${BLUE}BUILD COMPLETO! PRONTO PARA RODAR.${NC}" && \
    echo -e "${BLUE}========================================${NC}" && \
    echo ""

# Stage 2: Runner
FROM node:18-alpine AS runner

RUN echo -e "${GREEN}========================================${NC}" && \
    echo -e "${GREEN}  Preparando para Iniciar o Aplicativo  \033[0m" && \
    echo -e "${GREEN}========================================${NC}"

WORKDIR /app

# Copia os arquivos da etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/start.sh ./start.sh
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["/bin/sh", "start.sh"]
