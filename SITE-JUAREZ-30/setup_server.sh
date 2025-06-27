#!/bin/bash

# Cores e Emojis
GREEN='\033[0;32m'   # Sucesso
YELLOW='\033[1;33m'  # Atenção
BLUE='\033[0;34m'    # Etapas
RED='\033[0;31m'     # Erros
CYAN='\033[0;36m'    # Processos
PURPLE='\033[0;35m'  # Informações
NC='\033[0m'         # Reset

clear
echo -e "${BLUE}================================================================${NC}"
echo -e "${PURPLE}🌐 INSTALADOR AUTOMÁTICO — SIQUEIRA CAMPOS IMÓVEIS${NC}"
echo -e "${BLUE}================================================================${NC}"

# CONFIGS DO PROJETO
REPO="git@github.com:Nakahh/SITE-JUAREZ-30.git"
FOLDER="siqueira-campos-imoveis"

# SUBDOMÍNIOS
SUBDOMINIOS=("app.siqueicamposimoveis.com.br" "admin.siqueicamposimoveis.com.br")

# 0. Atualização geral do sistema
echo -e "\n${CYAN}🔄 Atualizando pacotes do sistema...${NC}"
sudo apt update -y && sudo apt upgrade -y

# 1. Instalar Docker + Compose
if ! command -v docker &> /dev/null; then
  echo -e "\n${CYAN}🐳 Instalando Docker e Docker Compose...${NC}"
  sudo apt install -y ca-certificates curl gnupg lsb-release
  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt update -y
  sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo usermod -aG docker $USER
  echo -e "${GREEN}✅ Docker instalado.${NC}"
else
  echo -e "${YELLOW}⏩ Docker já está instalado. Pulando...${NC}"
fi

# 2. Instalar PostgreSQL (se não estiver rodando via Docker e o usuário quiser local)
echo -e "\n${CYAN}🐘 Verificando PostgreSQL...${NC}"
if ! systemctl is-active --quiet postgresql; then
  read -p "Deseja instalar PostgreSQL LOCAL no host além do Docker (s/n)? " pg_local
  if [[ "$pg_local" == "s" ]]; then
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
    echo -e "${GREEN}✅ PostgreSQL local instalado.${NC}"
  else
    echo -e "${YELLOW}⏩ Ignorando PostgreSQL local.${NC}"
  fi
else
  echo -e "${YELLOW}✅ PostgreSQL já instalado e ativo.${NC}"
fi

# 3. Instalar Git
if ! command -v git &> /dev/null; then
  echo -e "\n${CYAN}📦 Instalando Git...${NC}"
  sudo apt install -y git
else
  echo -e "${YELLOW}✅ Git já instalado.${NC}"
fi

# 4. Adicionar espaço de swap (2GB)
echo -e "\n${CYAN}🧠 Criando espaço de swap...${NC}"
if ! grep -q "swapfile" /etc/fstab; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo -e "${GREEN}✅ Swap criado.${NC}"
else
  echo -e "${YELLOW}Swap já configurado.${NC}"
fi

# 5. Clonar ou atualizar repositório
echo -e "\n${CYAN}📁 Clonando ou atualizando projeto...${NC}"
if [ -d "$FOLDER/.git" ]; then
  cd "$FOLDER"
  git reset --hard
  git clean -fd
  git pull origin main
else
  git clone "$REPO" "$FOLDER"
  cd "$FOLDER"
fi

# 6. Criar arquivo .env automaticamente
echo -e "\n${CYAN}⚙️ Criando .env...${NC}"
cat << EOF > .env
DATABASE_URL="postgresql://sitejuarez:juarez123@localhost:5432/bdsitejuarez?schema=public"
POSTGRES_USER=vitornakah
POSTGRES_PASSWORD=nakah123
POSTGRES_DATABASE=siqueira_db
NEXTAUTH_SECRET=4298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b
NEXTAUTH_URL=https://app.siqueicamposimoveis.com.br
MINIO_ENDPOINT=https://storage.siqueicamposimoveis.com.br
MINIO_ACCESS_KEY=Juarez
MINIO_SECRET_KEY=Juarez.123
MINIO_BUCKET_NAME=juarez-site
RESEND_API_KEY=re_WRyNRULE_Mezz7zLti92oMRJG8oq5jKuv
OPENAI_API_KEY=SUA_OPENAI_API_KEY
EVOLUTION_API_URL=https://evo.siqueicamposimoveis.com.br
EVOLUTION_API_KEY=SUA_EVOLUTION_API_KEY
NEXT_PUBLIC_BASE_URL=https://app.siqueicamposimoveis.com.br
NEXT_PUBLIC_WHATSAPP_NUMBER=556285563905
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_GOOGLE_MAPS_API_KEY
TRAEFIK_EMAIL=seu.email@exemplo.com
TRAEFIK_DOMAIN=app.siqueicamposimoveis.com.br
SECRET_KEY=uma_chave_super_secreta_aleatoria
EOF

# 7. Build e deploy com Docker Compose
echo -e "\n${CYAN}🚢 Rodando Docker Compose...${NC}"
docker compose down --volumes
docker compose build --no-cache
docker compose up -d

# 8. Migrations Prisma
echo -e "\n${CYAN}🧩 Executando migrations Prisma...${NC}"
docker exec -it siqueira-frontend sh -c "npx prisma migrate deploy"

# 9. Exibir domínios
for sub in "${SUBDOMINIOS[@]}"; do
  echo -e "${GREEN}🌍 Acesse seu app em: https://$sub${NC}"
done

echo -e "\n${BLUE}============================================================${NC}"
echo -e "${PURPLE}✨ Instalação e Deploy Finalizados com Sucesso!${NC}"
echo -e "${BLUE}============================================================${NC}"
