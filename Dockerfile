# Stage 1: Builder
FROM node:18-slim AS builder # ALTERADO DE node:18-alpine PARA node:18-slim

# Cores ANSI para o terminal
ARG GREEN='\033[0;32m'
ARG YELLOW='\033[1;33m'
ARG BLUE='\033[0;34m'
ARG RED='\033[0;31m' # Adicionando cor vermelha para erros
ARG NC='\033[0m' # No Color

RUN echo -e "${BLUE}========================================${NC}" && \
    echo -e "${BLUE}🚀 INICIANDO FASE DE BUILD - SIQUEIRA CAMPOS IMÓVEIS${NC}" && \
    echo -e "${BLUE}========================================${NC}"

WORKDIR /app

COPY package*.json ./

# --- ETAPA DE DIAGNÓSTICO DE REDE FORÇADO ---
# Instala curl e iputils-ping para diagnóstico (se já não estiverem presentes na imagem slim)
# Usamos apt-get para Debian/Ubuntu-based images
RUN apt-get update && apt-get install -y curl iputils-ping

RUN echo -e "${YELLOW}Diagnóstico de rede: Tentando pingar registry.npmjs.org...\033[0m" && \
    ping -c 3 registry.npmjs.org 2>&1 || echo -e "${RED}Falha ao pingar registry.npmjs.org. Verifique sua conexão de rede/DNS.${NC}"

RUN echo -e "${YELLOW}Tentando curl https://registry.npmjs.org...${NC}" && \
    curl -v https://registry.npmjs.org 2>&1 || echo -e "${RED}Falha ao acessar https://registry.npmjs.org com curl. Verifique sua conexão de rede/proxy/firewall.${NC}"

# --- FIM DA ETAPA DE DIAGNÓSTICO DE REDE ---

# Configurações do npm (para tentar forçar o registro e SSL)
RUN echo "registry=https://registry.npmjs.org/" > .npmrc && \
    echo "strict-ssl=false" >> .npmrc && \
    echo "cafile=/etc/ssl/certs/ca-certificates.crt" >> .npmrc && \
    echo "dns-config=8.8.8.8,8.8.4.4" >> .npmrc && \
    echo -e "${YELLOW}Conteúdo de .npmrc:${NC}" && \
    cat .npmrc

# Tenta npm install. Se falhar com E404, tenta com --legacy-peer-deps e --force
RUN npm install || \
    (echo -e "${RED}npm install falhou com E404. Tentando com --legacy-peer-deps...${NC}" && \
     npm install --legacy-peer-deps) || \
    (echo -e "${RED}npm install --legacy-peer-deps falhou. Tentando com --force...${NC}" && \
     npm install --force) || \
    (echo -e "${RED}Todas as tentativas de npm install falharam. Verifique a rede e o registro.${NC}" && exit 1)

RUN echo -e "${GREEN}✅ Dependências instaladas com sucesso!${NC}" && \
    echo ""

# Etapa de Cópia de Arquivos e Build da Aplicação
RUN echo -e "${YELLOW}📋 Copiando arquivos do projeto e iniciando build do Next.js...${NC}"
COPY . .
RUN npm run build
RUN echo -e "${GREEN}✅ Build do Next.js concluído com sucesso!${NC}" && \
    echo -e "${BLUE}========================================${NC}" && \
    echo -e "${BLUE}BUILD COMPLETO! PRONTO PARA RODAR.${NC}" && \
    echo -e "${BLUE}========================================${NC}" && \
    echo ""

# Stage 2: Runner
FROM node:18-slim AS runner # ALTERADO DE node:18-alpine PARA node:18-slim

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
