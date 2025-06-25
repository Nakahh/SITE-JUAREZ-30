#!/bin/bash

# Cores ANSI
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "███████╗██╗ ██████╗ ██╗   ██╗███████╗██████╗ ███████╗██████╗ "
echo "██╔════╝██║██╔════╝ ██║   ██║██╔════╝██╔══██╗██╔════╝██╔══██╗"
echo "███████╗██║██║  ███╗██║   ██║█████╗  ██████╔╝█████╗  ██████╔╝"
echo "╚════██║██║██║   ██║██║   ██║██╔══╝  ██╔══██╗██╔══╝  ██╔══██╗"
echo "███████║██║╚██████╔╝╚██████╔╝███████╗██║  ██║███████╗██║  ██║"
echo "╚══════╝╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${BLUE}🚀 Iniciando Siqueira Campos Imóveis - Versão Dockerizada${NC}"
echo -e "${YELLOW}📅 Data: $(date)${NC}"
echo -e "${YELLOW}🌐 Ambiente: Produção (Docker)${NC}"
echo -e "${YELLOW}✨ Desenvolvido por: KRYONIX Development${NC}"
echo ""
echo -e "${GREEN}✅ Dependências instaladas e otimizadas.${NC}"
echo -e "${GREEN}✅ Aplicação Next.js pronta para servir.${NC}"
echo -e "${GREEN}✅ Conectando ao banco de dados PostgreSQL...${NC}"
echo ""

# Executa o comando de start do Next.js
npm start
