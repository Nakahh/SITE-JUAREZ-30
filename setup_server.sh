#!/bin/bash

# Cores para o terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 INICIANDO INSTALAÇÃO E DEPLOY AUTOMATIZADO${NC}"
echo -e "${BLUE}========================================${NC}"

# --- 1. Atualizar o Sistema Operacional ---
echo -e "${YELLOW}1. Atualizando o sistema operacional...${NC}"
sudo apt update -y && sudo apt upgrade -y
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao atualizar o sistema.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Sistema atualizado.${NC}"

# --- 2. Instalar Docker Engine e Docker Compose Plugin ---
echo -e "${YELLOW}2. Instalando Docker Engine e Docker Compose Plugin...${NC}"
sudo apt install -y ca-certificates curl gnupg lsb-release
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao instalar dependências do Docker.${NC}"; exit 1; fi

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao adicionar chave GPG do Docker.${NC}"; exit 1; fi

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao adicionar repositório do Docker.${NC}"; exit 1; fi

sudo apt update -y
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao atualizar apt após adicionar repositório Docker.${NC}"; exit 1; fi

sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao instalar pacotes Docker. Verifique a saída acima.${NC}"; exit 1; fi

sudo usermod -aG docker $USER
echo -e "${GREEN}✅ Docker instalado e usuário adicionado ao grupo docker.${NC}"

# --- 3. Instalar Git ---
echo -e "${YELLOW}3. Instalando Git...${NC}"
sudo apt install git -y
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao instalar Git.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Git instalado.${NC}"

# --- 4. Adicionar Espaço de Swap (CRUCIAL para VMs com pouca RAM) ---
echo -e "${YELLOW}4. Adicionando 2GB de espaço de swap...${NC}"
# Verifica se já existe um arquivo swap
if grep -q "swapfile" /etc/fstab; then
    echo -e "${YELLOW}Arquivo swap já existe. Pulando criação.${NC}"
else
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo -e "${GREEN}✅ Espaço de swap de 2GB adicionado e ativado.${NC}"
fi

# --- 5. Clonar seu Projeto ---
echo -e "${YELLOW}5. Clonando seu projeto do GitHub...${NC}"
# ATENÇÃO: SUBSTITUA PELO URL REAL DO SEU REPOSITÓRIO GITHUB
PROJECT_REPO="https://github.com/seu-usuario/seu-repositorio.git"
PROJECT_DIR="siqueira-campos-imoveis"

if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}Diretório do projeto '$PROJECT_DIR' já existe. Pulando clonagem.${NC}"
    echo -e "${YELLOW}Certifique-se de que o conteúdo está atualizado (git pull manual se necessário).${NC}"
else
    git clone "$PROJECT_REPO" "$PROJECT_DIR"
    if [ $? -ne 0 ]; then echo -e "${RED}Erro ao clonar o repositório. Verifique o URL e suas permissões.${NC}"; exit 1; fi
    echo -e "${GREEN}✅ Projeto clonado em '$PROJECT_DIR'.${NC}"
fi

cd "$PROJECT_DIR" || { echo -e "${RED}Erro: Não foi possível entrar no diretório do projeto.${NC}"; exit 1; }

# --- 6. Configurar o Arquivo .env ---
echo -e "${YELLOW}6. Configurando o arquivo .env...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Criando arquivo .env. Por favor, edite-o com suas variáveis de ambiente.${NC}"
    cat << EOF > .env
# Variáveis para o Banco de Dados
DATABASE_URL="postgresql://vitornakah:nakah123@postgres:5432/siqueira_db?schema=public"
POSTGRES_USER=vitornakah
POSTGRES_PASSWORD=nakah123
POSTGRES_DATABASE=siqueira_db

# Variáveis do NextAuth
NEXTAUTH_SECRET=4298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b
NEXTAUTH_URL=https://siqueicamposimoveis.com.br # SEU DOMÍNIO REAL AQUI

# Variáveis do MinIO (Vercel Blob)
MINIO_ENDPOINT=https://storage.siqueicamposimoveis.com.br # SEU SUBDOMÍNIO REAL AQUI
MINIO_ACCESS_KEY=Juarez
MINIO_SECRET_KEY=Juarez.123
MINIO_BUCKET_NAME=juarez-site

# Variáveis de API
RESEND_API_KEY=re_WRyNRULE_Mezz7zLti92oMRJG8oq5jKuv
OPENAI_API_KEY=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
EVOLUTION_API_URL=https://evo.siqueicamposimoveis.com.br # SEU SUBDOMÍNIO REAL AQUI
EVOLUTION_API_KEY=aeb9b8541f0567865fa02df9a0aea5a0

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
    echo -e "${YELLOW}Por favor, edite o arquivo .env AGORA com seus dados reais e salve (Ctrl+X, Y, Enter).${NC}"
    read -p "Pressione Enter para continuar após editar o .env..."
else
    echo -e "${YELLOW}Arquivo .env já existe. Certifique-se de que está configurado corretamente.${NC}"
    read -p "Pressione Enter para continuar..."
fi
echo -e "${GREEN}✅ Arquivo .env verificado/criado.${NC}"

# --- 7. Verificar e Atualizar Dockerfile e docker-compose.yml ---
echo -e "${YELLOW}7. Verificando Dockerfile e docker-compose.yml...${NC}"
# Aqui você deve garantir que seu Dockerfile e docker-compose.yml no repositório estão atualizados.
# O script assume que eles já estão corretos no seu repositório clonado.
# Se precisar de ajustes, faça-os no seu repositório e puxe as mudanças.
echo -e "${GREEN}✅ Dockerfile e docker-compose.yml assumidos como corretos no repositório.${NC}"

# --- 8. Executar o Deploy do Docker Compose ---
echo -e "${YELLOW}8. Executando o deploy do Docker Compose...${NC}"
echo -e "${YELLOW}Desligando e removendo contêineres/volumes antigos...${NC}"
docker compose down --volumes # Use --volumes para limpar dados do DB se for um novo deploy
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao derrubar contêineres antigos.${NC}"; exit 1; fi

echo -e "${YELLOW}Reconstruindo imagens Docker (isso pode levar tempo e usar swap)...${NC}"
docker compose build --no-cache
if [ $? -ne 0 ]; then echo -e "${RED}Erro crítico ao construir imagens Docker. Verifique os logs acima.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Imagens Docker construídas com sucesso.${NC}"

echo -e "${YELLOW}Subindo os serviços...${NC}"
docker compose up -d
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao subir os serviços Docker Compose.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Serviços Docker Compose iniciados.${NC}"

# --- 9. Aplicar Migrações do Prisma ---
echo -e "${YELLOW}9. Aplicando migrações do Prisma...${NC}"
docker compose exec frontend npx prisma migrate deploy
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao aplicar migrações do Prisma.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Migrações do Prisma aplicadas.${NC}"

# --- 10. Verificar o Status dos Contêineres ---
echo -e "${YELLOW}10. Verificando o status dos contêineres...${NC}"
docker compose ps
echo -e "${GREEN}✅ Status dos contêineres verificado.${NC}"

# --- 11. Instalar Portainer (Opcional) ---
echo -e "${YELLOW}11. Instalando Portainer para gerenciamento visual...${NC}"
cd ~ # Voltar para o diretório home
docker volume create portainer_data
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao criar volume do Portainer.${NC}"; exit 1; fi

docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
if [ $? -ne 0 ]; then echo -e "${RED}Erro ao iniciar contêiner do Portainer.${NC}"; exit 1; fi
echo -e "${GREEN}✅ Portainer instalado. Acesse em https://SEU_IP_PUBLICO_DA_AWS:9443${NC}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🎉 DEPLOY CONCLUÍDO! 🎉${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Seu site deve estar acessível em: https://${TRAEFIK_DOMAIN}${NC}"
echo -e "${GREEN}Dashboard do Traefik (se configurado): https://traefik.${TRAEFIK_DOMAIN}${NC}"
echo -e "${GREEN}Dashboard do Portainer: https://SEU_IP_PUBLICO_DA_AWS:9443${NC}"
echo -e "${YELLOW}Lembre-se de configurar o webhook da Evolution API para: https://${TRAEFIK_DOMAIN}/api/whatsapp-webhook${NC}"
echo -e "${YELLOW}Se houver problemas, verifique os logs com: docker compose logs -f frontend${NC}"
