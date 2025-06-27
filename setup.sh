#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções de log
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}🚀 SIQUEIRA CAMPOS IMÓVEIS - SETUP AUTOMATIZADO 🚀${NC}"
echo -e "${BLUE}====================================================${NC}"
echo -e "${PURPLE}Este script ir�� configurar o ambiente de desenvolvimento${NC}"
echo -e "${PURPLE}Desenvolvido por: KRYONIX Development${NC}"
echo -e "${BLUE}====================================================${NC}"

# Verificar se está no diretório correto
if [[ ! -f "package.json" ]]; then
    error "Este script deve ser executado na raiz do projeto!"
    exit 1
fi

# Verificar Node.js
log "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js não está instalado!"
    echo "Por favor, instale Node.js 18+ antes de continuar"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [[ $NODE_VERSION -lt 18 ]]; then
    error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

log "Node.js $(node -v) encontrado ✅"

# Verificar package manager
PACKAGE_MANAGER=""
if [[ -f "yarn.lock" ]]; then
    PACKAGE_MANAGER="yarn"
elif [[ -f "pnpm-lock.yaml" ]]; then
    PACKAGE_MANAGER="pnpm"
else
    PACKAGE_MANAGER="npm"
fi

log "Package manager detectado: $PACKAGE_MANAGER"

# Verificar PostgreSQL
log "Verificando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    warning "PostgreSQL não encontrado no sistema"
    echo -e "${YELLOW}Você pode:${NC}"
    echo "1. Instalar PostgreSQL localmente"
    echo "2. Usar Docker para PostgreSQL"
    echo "3. Usar um serviço em nuvem (Neon, Supabase, etc.)"
    echo ""
    read -p "Deseja continuar mesmo assim? (y/n): " continue_setup
    if [[ $continue_setup != "y" ]]; then
        exit 1
    fi
else
    log "PostgreSQL encontrado ✅"
fi

# Configurar variáveis de ambiente
log "Configurando variáveis de ambiente..."
if [[ ! -f ".env" ]]; then
    if [[ -f ".env.example" ]]; then
        cp .env.example .env
        log "Arquivo .env criado a partir do .env.example"
    else
        error "Arquivo .env.example não encontrado!"
        exit 1
    fi
    
    echo -e "${YELLOW}IMPORTANTE: Configure o arquivo .env com suas credenciais reais!${NC}"
    echo "Principais variáveis para configurar:"
    echo "- DATABASE_URL (banco PostgreSQL)"
    echo "- NEXTAUTH_SECRET (chave de autenticação)"
    echo "- OPENAI_API_KEY (para chatbot)"
    echo "- RESEND_API_KEY (para emails)"
    echo ""
    read -p "Pressione Enter para continuar..."
else
    log "Arquivo .env já existe"
fi

# Instalar dependências
log "Instalando dependências..."
case $PACKAGE_MANAGER in
    "yarn")
        yarn install
        ;;
    "pnpm")
        pnpm install
        ;;
    *)
        npm install
        ;;
esac

if [[ $? -ne 0 ]]; then
    error "Falha ao instalar dependências!"
    exit 1
fi

log "Dependências instaladas com sucesso ✅"

# Gerar cliente Prisma
log "Gerando cliente Prisma..."
npx prisma generate

if [[ $? -ne 0 ]]; then
    error "Falha ao gerar cliente Prisma!"
    exit 1
fi

log "Cliente Prisma gerado com sucesso ✅"

# Verificar conexão com banco de dados
log "Verificando conexão com banco de dados..."
if npx prisma db push --accept-data-loss 2>/dev/null; then
    log "Conexão com banco estabelecida e schema aplicado ✅"
    
    # Executar seed
    log "Populando banco de dados..."
    if [[ -f "scripts/seed.ts" ]]; then
        npx tsx scripts/seed.ts
        if [[ $? -eq 0 ]]; then
            log "Banco de dados populado com sucesso ✅"
        else
            warning "Falha ao popular banco de dados"
        fi
    else
        warning "Script de seed não encontrado"
    fi
else
    warning "Não foi possível conectar ao banco de dados"
    echo "Verifique a variável DATABASE_URL no arquivo .env"
fi

# Build da aplicação
log "Fazendo build da aplicação..."
case $PACKAGE_MANAGER in
    "yarn")
        yarn build
        ;;
    "pnpm")
        pnpm build
        ;;
    *)
        npm run build
        ;;
esac

if [[ $? -eq 0 ]]; then
    log "Build concluído com sucesso ✅"
else
    warning "Build falhou - verifique os erros acima"
fi

# Verificar scripts disponíveis
log "Scripts disponíveis:"
echo "- dev: Iniciar servidor de desenvolvimento"
echo "- build: Fazer build para produção"
echo "- start: Iniciar servidor de produção"
echo "- lint: Verificar código"
echo "- test: Executar testes"

echo -e "\n${BLUE}====================================================${NC}"
echo -e "${GREEN}✅ SETUP CONCLUÍDO COM SUCESSO! ✅${NC}"
echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}Para iniciar o servidor de desenvolvimento:${NC}"
echo -e "${CYAN}${PACKAGE_MANAGER} run dev${NC}"
echo ""
echo -e "${GREEN}URLs importantes:${NC}"
echo -e "${CYAN}http://localhost:3000${NC} - Site principal"
echo -e "${CYAN}http://localhost:3000/admin${NC} - Painel administrativo"
echo -e "${CYAN}http://localhost:3000/login${NC} - Login"
echo ""
echo -e "${GREEN}Credenciais padrão (se o seed foi executado):${NC}"
echo "Owner: siqueiraecamposimoveis@gmail.com / Juarez.123"
echo "Admin: admin@email.com / admin123"
echo "Agent: agent@email.com / agent123"
echo "User: user@email.com / user123"
echo "Client: client@email.com / client123"
echo ""
echo -e "${GREEN}Próximos passos:${NC}"
echo "1. Configure suas variáveis de ambiente no arquivo .env"
echo "2. Execute: ${PACKAGE_MANAGER} run dev"
echo "3. Acesse http://localhost:3000"
echo ""
echo -e "${BLUE}Suporte técnico: KRYONIX Development${NC}"
echo -e "${BLUE}WhatsApp: +55 17 98180-5327${NC}"
echo -e "${BLUE}Instagram: @kryon.ix${NC}"
echo -e "${BLUE}====================================================${NC}"
