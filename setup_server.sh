#!/bin/bash

# Cores para o terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}🚀 INICIANDO INSTALAÇÃO E DEPLOY AUTOMATIZADO DO SITE 🚀${NC}"
echo -e "${BLUE}====================================================${NC}"
echo -e "${PURPLE}Este script irá configurar seu ambiente, clonar o projeto e iniciar os serviços Docker.${NC}"
echo -e "${PURPLE}Certifique-se de ter as permissões SSH configuradas para o GitHub.${NC}"
echo -e "${BLUE}====================================================${NC}"

# --- 1. Atualizar o Sistema Operacional ---
echo -e "\n${CYAN}--- PASSO 1: Atualizando o sistema operacional ---${NC}"
echo -e "${YELLOW}Verificando e aplicando atualizações...${NC}"
sudo apt update -y && sudo apt upgrade -y
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao atualizar o sistema. Por favor, verifique sua conexão e tente novamente.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Sistema operacional atualizado com sucesso.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 2. Instalar Docker Engine e Docker Compose Plugin ---
echo -e "\n${CYAN}--- PASSO 2: Instalando Docker Engine e Docker Compose Plugin ---${NC}"
echo -e "${YELLOW}Verificando e instalando dependências do Docker...${NC}"
sudo apt install -y ca-certificates curl gnupg lsb-release
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao instalar dependências do Docker.${NC}"; exit 1; fi

echo -e "${YELLOW}Adicionando chave GPG e repositório oficial do Docker...${NC}"
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao adicionar chave GPG do Docker.${NC}"; exit 1; fi

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao adicionar repositório do Docker.${NC}"; exit 1; fi

sudo apt update -y
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao atualizar apt após adicionar repositório Docker.${NC}"; exit 1; fi

echo -e "${YELLOW}Instalando pacotes Docker...${NC}"
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao instalar pacotes Docker. Verifique a saída acima.${NC}"; exit 1; fi

sudo usermod -aG docker $USER
echo -e "${GREEN}✅ Docker Engine e Docker Compose Plugin instalados e usuário adicionado ao grupo 'docker'.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 3. Instalar Git ---
echo -e "\n${CYAN}--- PASSO 3: Instalando Git ---${NC}"
echo -e "${YELLOW}Verificando e instalando Git...${NC}"
sudo apt install git -y
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao instalar Git.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Git instalado com sucesso.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 4. Adicionar Espaço de Swap (CRUCIAL para VMs com pouca RAM) ---
echo -e "\n${CYAN}--- PASSO 4: Adicionando Espaço de Swap (2GB) ---${NC}"
# Verifica se já existe um arquivo swap
if grep -q "swapfile" /etc/fstab; then
    echo -e "${YELLOW}Arquivo swap já existe. Pulando criação.${NC}"
else
    echo -e "${YELLOW}Criando e ativando arquivo swap de 2GB...${NC}"
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo -e "${GREEN}✅ Espaço de swap de 2GB adicionado e ativado.${NC}"
fi
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 5. Limpar e Clonar seu Projeto ---
echo -e "\n${CYAN}--- PASSO 5: Clonando seu Projeto do GitHub via SSH ---${NC}"
PROJECT_REPO="git@github.com:Nakahh/SITE-JUAREZ-30.git" # URL SSH do seu repositório
PROJECT_DIR="siqueira-campos-imoveis"

# Remove o diretório antigo para garantir um clone limpo
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}Removendo diretório existente: $PROJECT_DIR${NC}"
    rm -rf "$PROJECT_DIR"
fi

echo -e "${YELLOW}Clonando o repositório: ${PROJECT_REPO} para ${PROJECT_DIR}...${NC}"
git clone "$PROJECT_REPO" "$PROJECT_DIR"
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao clonar o repositório. Verifique o URL e suas permissões SSH (chave pública no GitHub).${NC}"; exit 1; fi
echo -e "${GREEN}✅ Projeto clonado com sucesso em '$PROJECT_DIR'.${NC}"

cd "$PROJECT_DIR" || { echo -e "${RED}❌ Erro: Não foi possível entrar no diretório do projeto '$PROJECT_DIR'.${NC}"; exit 1; }
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 6. Configurar o Arquivo .env (Criar e Pausar para Edição) ---
echo -e "\n${CYAN}--- PASSO 6: Configurando o arquivo .env ---${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Criando arquivo .env com valores padrão. Por favor, edite-o com suas variáveis de ambiente reais.${NC}"
    cat << EOF > .env
# Variáveis para o Banco de Dados
DATABASE_URL="postgresql://USUARIO:SENHA@postgres:5432/siqueira_db?schema=public"
POSTGRES_USER=USUARIO
POSTGRES_PASSWORD=SENHA
POSTGRES_DATABASE=siqueira_db

# Variáveis do NextAuth
NEXTAUTH_SECRET=CHAVE_SECRETA_GERADA_ALEATORIAMENTE
NEXTAUTH_URL=https://SEU_DOMINIO.com.br

# Variáveis do MinIO (Vercel Blob)
MINIO_ENDPOINT=https://storage.SEU_DOMINIO.com.br
MINIO_ACCESS_KEY=SEU_ACCESS_KEY
MINIO_SECRET_KEY=SUA_SECRET_KEY
MINIO_BUCKET_NAME=nome-do-bucket

# Variáveis de API
RESEND_API_KEY=SUA_CHAVE_RESEND_API
OPENAI_API_KEY=SUA_CHAVE_OPENAI_API
EVOLUTION_API_URL=https://evo.SEU_DOMINIO.com.br
EVOLUTION_API_KEY=SUA_CHAVE_EVOLUTION_API

# Variáveis Públicas do Next.js (prefixadas com NEXT_PUBLIC_)
NEXT_PUBLIC_BASE_URL=https://siqueicamposimoveis.com.br # SEU DOMÍNIO REAL AQUI
NEXT_PUBLIC_WHATSAPP_NUMBER=556285563905
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_GOOGLE_MAPS_API_KEY_AQUI # Opcional, se precisar de funcionalidades avançadas do Google Maps

# Variáveis para o Traefik (para Let's Encrypt)
TRAEFIK_EMAIL=seu.email@exemplo.com # SEU E-MAIL REAL AQUI para notificações do Let's Encrypt
TRAEFIK_DOMAIN=siqueicamposimoveis.com.br # SEU DOMÍNIO PRINCIPAL REAL AQUI

# Variável Secreta Geral (se usada pelo app)
SECRET_KEY=uma_chave_secreta_longa_e_complexa_aqui_gerada_aleatoriamente
EOF
    echo -e "${YELLOW}*** PAUSA PARA EDIÇÃO DO .ENV ***${NC}"
    echo -e "${YELLOW}Por favor, edite o arquivo .env AGORA com seus dados reais e salve (Ctrl+X, Y, Enter).${NC}"
    nano .env # Abre o editor para o usuário editar
    echo -e "${YELLOW}*** EDIÇÃO DO .ENV CONCLUÍDA. CONTINUANDO... ***${NC}"
else
    echo -e "${YELLOW}Arquivo .env já existe. Certifique-se de que está configurado corretamente.${NC}"
    read -p "Pressione Enter para continuar..."
fi
echo -e "${GREEN}✅ Arquivo .env verificado/criado.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 7. Verificar e Atualizar Dockerfile e docker-compose.yml ---
echo -e "\n${CYAN}--- PASSO 7: Verificando Dockerfile e docker-compose.yml ---${NC}"
echo -e "${YELLOW}O script assume que seu Dockerfile e docker-compose.yml no repositório estão atualizados.${NC}"
echo -e "${YELLOW}Se você fez alterações locais, elas serão sobrescritas pelo git clone/pull.${NC}"
echo -e "${GREEN}✅ Dockerfile e docker-compose.yml assumidos como corretos no repositório.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 8. Executar o Deploy do Docker Compose ---
echo -e "\n${CYAN}--- PASSO 8: Executando o Deploy do Docker Compose ---${NC}"
echo -e "${YELLOW}Desligando e removendo contêineres/volumes antigos (isso pode limpar dados do DB se for um novo deploy)...${NC}"
docker compose down --volumes # Use --volumes para limpar dados do DB se for um novo deploy
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao derrubar contêineres antigos.${NC}"; exit 1; fi

echo -e "${YELLOW}Reconstruindo imagens Docker (isso pode levar tempo e usar swap)...${NC}"
docker compose build --no-cache
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro crítico ao construir imagens Docker. Verifique os logs acima.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Imagens Docker construídas com sucesso.${NC}"

echo -e "${YELLOW}Subindo os serviços...${NC}"
docker compose up -d
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao subir os serviços Docker Compose.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Serviços Docker Compose iniciados.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 9. Aplicar Migrações do Prisma ---
echo -e "\n${CYAN}--- PASSO 9: Aplicando Migrações do Prisma ---${NC}"
echo -e "${YELLOW}Executando 'npx prisma migrate deploy' no contêiner frontend...${NC}"
docker compose exec frontend npx prisma migrate deploy
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao aplicar migrações do Prisma. Verifique se o banco de dados está acessível.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Migrações do Prisma aplicadas com sucesso.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 10. Verificar o Status dos Contêineres ---
echo -e "\n${CYAN}--- PASSO 10: Verificando o Status dos Contêineres ---${NC}"
echo -e "${YELLOW}Listando os contêineres Docker Compose...${NC}"
docker compose ps
echo -e "${GREEN}✅ Status dos contêineres verificado.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 11. Verificar os Logs do Frontend (para depuração inicial) ---
echo -e "\n${CYAN}--- PASSO 11: Exibindo os Últimos Logs do Frontend ---${NC}"
echo -e "${YELLOW}Pressione Ctrl+C para sair da visualização dos logs.${NC}"
docker compose logs -f frontend
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- 12. Instalar Portainer (Opcional) ---
echo -e "\n${CYAN}--- PASSO 12: Instalando Portainer para Gerenciamento Visual (Opcional) ---${NC}"
cd ~ # Voltar para o diretório home
echo -e "${YELLOW}Criando volume para dados do Portainer...${NC}"
docker volume create portainer_data
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao criar volume do Portainer.${NC}"; exit 1; fi

echo -e "${YELLOW}Iniciando contêiner do Portainer...${NC}"
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
if [ $? -ne 0 ]; then echo -e "${RED}❌ Erro ao iniciar contêiner do Portainer.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Portainer instalado. Você poderá acessá-lo em breve via domínio.${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

# --- FINALIZAÇÃO ---
TRAEFIK_DOMAIN="siqueicamposimoveis.com.br" # Definindo o domínio principal para as mensagens finais

echo -e "\n${BLUE}====================================================${NC}"
echo -e "${BLUE}🎉 DEPLOY CONCLUÍDO COM SUCESSO! 🎉${NC}"
echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}Seu projeto está agora acessível nos seguintes endereços (após a propagação do DNS e configuração do Traefik):${NC}"
echo -e "${GREEN}----------------------------------------------------${NC}"
echo -e "${GREEN}🌐 Site Principal: ${PURPLE}https://${TRAEFIK_DOMAIN}${NC}"
echo -e "${GREEN}🌐 Subdomínio WWW: ${PURPLE}https://www.${TRAEFIK_DOMAIN}${NC}"
echo -e "${GREEN}📱 Painel do Usuário (App): ${PURPLE}https://app.${TRAEFIK_DOMAIN}${NC}"
echo -e "${GREEN}⚙️ Painel Administrativo: ${PURPLE}https://admin.${TRAEFIK_DOMAIN}${NC}"
echo -e "${GREEN}📦 MinIO Storage: ${PURPLE}https://storage.${TRAEFIK_DOMAIN}${NC}"
echo -e "${GREEN}🐳 Portainer Dashboard: ${PURPLE}https://portainer.${TRAEFIK_DOMAIN}${NC}"
echo -e "${GREEN}💬 Evolution API Manager: ${PURPLE}https://evo.${TRAEFIK_DOMAIN}/manager${NC}"
echo -e "${GREEN}----------------------------------------------------${NC}"
echo -e "${YELLOW}⚠️ AVISO IMPORTANTE: Configuração de DNS ⚠️${NC}"
echo -e "${YELLOW}Certifique-se de que os seguintes registros DNS (Tipo A ou CNAME) estão apontando para o IP público da sua VM:${NC}"
echo -e "${YELLOW}- ${TRAEFIK_DOMAIN}${NC}"
echo -e "${YELLOW}- www.${TRAEFIK_DOMAIN}${NC}"
echo -e "${YELLOW}- app.${TRAEFIK_DOMAIN}${NC}"
echo -e "${YELLOW}- admin.${TRAEFIK_DOMAIN}${NC}"
echo -e "${YELLOW}- storage.${TRAEFIK_DOMAIN}${NC}"
echo -e "${YELLOW}- portainer.${TRAEFIK_DOMAIN}${NC}"
echo -e "${YELLOW}- evo.${TRAEFIK_DOMAIN}${NC}"
echo -e "${YELLOW}Isso é CRUCIAL para que os domínios funcionem corretamente com o Traefik e o Let's Encrypt.${NC}"
echo -e "${YELLOW}----------------------------------------------------${NC}"
echo -e "${YELLOW}Lembre-se de configurar o webhook da Evolution API para: ${PURPLE}https://${TRAEFIK_DOMAIN}/api/whatsapp-webhook${NC}"
echo -e "${YELLOW}Para depuração, verifique os logs do frontend com: ${PURPLE}docker compose logs -f frontend${NC}"
echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}✨ PRÓXIMOS PASSOS: Acesse seus painéis e configure o DNS! ✨${NC}"
echo -e "${BLUE}====================================================${NC}"
