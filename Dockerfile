# Stage 1: Builder
FROM node:18-slim AS builder

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

# --- ETAPA DE DIAGNÓSTICO DE REDE E INSTALAÇÃO DO YARN ---
# Instala curl, iputils-ping e yarn
RUN apt-get update && apt-get install -y curl iputils-ping && \
    npm install -g yarn && \
    echo -e "${GREEN}✅ Yarn instalado com sucesso!${NC}"

# Força a saída do ping e curl para o log
RUN echo -e "${YELLOW}Diagnóstico de rede: Tentando pingar registry.npmjs.org...\033[0m" && \
    ping -c 3 registry.npmjs.org 2>&1 | tee /dev/stderr || echo -e "${RED}Falha ao pingar registry.npmjs.org. Verifique sua conexão de rede/DNS.${NC}"

RUN echo -e "${YELLOW}Tentando curl https://registry.npmjs.org...${NC}" && \
    curl -v https://registry.npmjs.org 2>&1 | tee /dev/stderr || echo -e "${RED}Falha ao acessar https://registry.npmjs.org com curl. Verifique sua conexão de rede/proxy/firewall.${NC}"

# --- FIM DA ETAPA DE DIAGNÓSTICO DE REDE ---

# --- ETAPA DE INSTALAÇÃO DE DEPENDÊNCIAS COM YARN ---
RUN echo -e "${YELLOW}Instalando dependências com Yarn...${NC}" && \
    yarn install --network-timeout 100000 || \
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
FROM node:18-slim AS runner

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
