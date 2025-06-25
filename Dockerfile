FROM node:18-alpine AS builder

# Cores ANSI para o terminal
ARG GREEN='\033[0;32m'
ARG YELLOW='\033[1;33m'
ARG BLUE='\033[0;34m'
ARG RED='\033[0;31m' # Adicionando cor vermelha para erros
ARG NC='\033[0m' # No Color

WORKDIR /app

# Etapa de Instalação de Dependências
RUN echo -e "${BLUE}========================================${NC}" && \
    echo -e "${BLUE}🚀 INICIANDO FASE DE BUILD - SIQUEIRA CAMPOS IMÓVEIS${NC}" && \
    echo -e "${BLUE}========================================${NC}" && \
    echo "" && \
    echo -e "${YELLOW}📦 Copiando package.json e instalando dependências...${NC}"
COPY package*.json ./

# --- ETAPA DE DIAGNÓSTICO DE REDE ---
RUN echo -e "${YELLOW}Diagnóstico de rede: Tentando pingar registry.npmjs.org...${NC}" && \
    ping -c 3 registry.npmjs.org || echo -e "${RED}Falha ao pingar registry.npmjs.org. Verifique sua conexão de rede/DNS.${NC}" && \
    echo -e "${YELLOW}Tentando curl https://registry.npmjs.org...${NC}" && \
    apk add --no-cache curl && \
    curl -v https://registry.npmjs.org || echo -e "${RED}Falha ao acessar https://registry.npmjs.org com curl. Verifique sua conexão de rede/proxy/firewall.${NC}" && \
    echo ""
# --- FIM DA ETAPA DE DIAGNÓSTICO DE REDE ---

RUN npm install
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

FROM node:18-alpine AS runner
WORKDIR /app

# Copia os arquivos da etapa de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copia o script de inicialização
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

# Define o comando de inicialização para o nosso script decorado
CMD ["./start.sh"]
