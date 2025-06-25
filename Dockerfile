# Stage 1: Builder
FROM node:18-alpine AS builder

# Decorando o processo de build
RUN echo -e "\033[0;34m========================================\033[0m" && \
    echo -e "\033[0;34m  Iniciando Build do Siqueira Campos Imóveis  \033[0m" && \
    echo -e "\033[0;34m========================================\033[0m"

WORKDIR /app

# Diagnóstico de rede (manter para depuração)
RUN echo -e "\033[1;33mDiagnóstico de rede: Tentando pingar registry.npmjs.org...\033[0m" && \
    ping -c 3 registry.npmjs.org || echo "Ping falhou, pode ser problema de DNS ou rede." && \
    echo -e "\033[1;33mTentando curl https://registry.npmjs.org...\033[0m" && \
    curl -v https://registry.npmjs.org || echo "Curl falhou, pode ser problema de conectividade."

COPY package*.json ./

# TENTATIVA DE SOLUÇÃO: Forçar DNS para npm install
# Adiciona um arquivo de configuração npm para usar um registro específico com DNS
# Isso é uma tentativa de contornar problemas de DNS no ambiente de build
RUN echo "registry=https://registry.npmjs.org/" > .npmrc && \
    echo "strict-ssl=false" >> .npmrc && \
    echo "cafile=/etc/ssl/certs/ca-certificates.crt" >> .npmrc && \
    echo "dns-config=8.8.8.8,8.8.4.4" >> .npmrc && \
    npm install

# Copia o script de inicialização
COPY start.sh ./

# Stage 2: Runner
FROM node:18-alpine

# Decorando o processo de inicialização
RUN echo -e "\033[0;32m========================================\033[0m" && \
    echo -e "\033[0;32m  Preparando para Iniciar o Aplicativo  \033[0m" && \
    echo -e "\033[0;32m========================================\033[0m"

WORKDIR /app

# Copia os arquivos da etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/start.sh ./start.sh
COPY --from=builder /app/package.json ./package.json # Necessário para o start.sh

# Expor a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar o aplicativo usando o script decorado
CMD ["/bin/sh", "start.sh"]
