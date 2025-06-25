#!/bin/bash

echo "🚀 DEPLOY COMPLETO - Siqueira Campos Imóveis"
echo "📅 Data: $(date)"
echo "👨‍💻 Desenvolvido por: KRYONIX Development"

# Configurações
PROJECT_NAME="siqueira-campos-imoveis"
DOMAIN="siqueiracamposimoveis.com.br"
AWS_HOST="13.53.62.86"
AWS_USER="ubuntu"
KEY_PATH="./Juarez-chave-SSH.pem" # Certifique-se de que esta chave está na raiz do seu projeto local

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
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

# Verificar pré-requisitos
log "Verificando pré-requisitos..."

if [ ! -f "$KEY_PATH" ]; then
    error "Chave SSH não encontrada: $KEY_PATH"
    echo "Por favor, coloque a chave Juarez-chave-SSH.pem na raiz do projeto"
    exit 1
fi

if ! command -v node &> /dev/null; then
    error "Node.js não está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm não está instalado"
    exit 1
fi

# Definir permissões da chave SSH
chmod 400 "$KEY_PATH"
log "Permissões da chave SSH configuradas"

# Executar testes locais
log "Executando testes locais..."
npm run lint
if [ $? -ne 0 ]; then
    warning "Alguns warnings de lint encontrados, mas continuando..."
fi

# Build local para verificar se está tudo OK
log "Executando build local..."
npm run build
if [ $? -ne 0 ]; then
    error "Build falhou! Corrija os erros antes de fazer deploy"
    exit 1
fi

log "Build local concluído com sucesso!"

# Preparar arquivos para deploy
log "Preparando arquivos para deploy..."

# Criar arquivo de exclusão para tar
cat > .deployignore << 'EOF'
node_modules
.next
.git
*.log
project.tar.gz
.deployignore
.env.local # Não enviar o .env.local local, pois um novo será criado no servidor
.env
coverage
.nyc_output
EOF

# Criar arquivo tar com o projeto
tar -czf project.tar.gz \
    --exclude-from=.deployignore \
    .

log "Arquivos preparados ($(du -h project.tar.gz | cut -f1))"

# Testar conexão SSH
log "Testando conexão SSH..."
ssh -i "$KEY_PATH" -o ConnectTimeout=10 "$AWS_USER@$AWS_HOST" "echo 'Conexão SSH OK'" 2>/dev/null
if [ $? -ne 0 ]; then
    error "Não foi possível conectar ao servidor AWS"
    error "Verifique se a instância está rodando e a chave SSH está correta"
    exit 1
fi

log "Conexão SSH estabelecida com sucesso!"

# Enviar arquivos para o servidor
log "Enviando arquivos para o servidor..."
scp -i "$KEY_PATH" project.tar.gz "$AWS_USER@$AWS_HOST:/home/$AWS_USER/"
if [ $? -ne 0 ]; then
    error "Falha ao enviar arquivos"
    exit 1
fi

log "Arquivos enviados com sucesso!"

# Executar comandos no servidor
log "Configurando servidor..."

ssh -i "$KEY_PATH" "$AWS_USER@$AWS_HOST" << 'EOF'
set -e

echo "🔧 Iniciando configuração do servidor..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18 se não estiver instalado
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verificar versão do Node.js
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Instalar PostgreSQL se não estiver instalado
if ! command -v psql &> /dev/null; then
    echo "📦 Instalando PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib
    
    # Configurar PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Criar usuário e banco de dados (se não existirem)
    # O nome do banco de dados é "site-juarez-4.0-v0" conforme definido no projeto
    sudo -u postgres psql << 'PSQL'
        DO $$ BEGIN
            IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'site-juarez-4.0-v0') THEN
                CREATE DATABASE "site-juarez-4.0-v0";
            END IF;
        END $$;
        
        DO $$ BEGIN
            IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'siqueira_user') THEN
                CREATE USER siqueira_user WITH PASSWORD 'siqueira_pass_2024';
            END IF;
        END $$;
        
        GRANT ALL PRIVILEGES ON DATABASE "site-juarez-4.0-v0" TO siqueira_user;
        ALTER USER siqueira_user CREATEDB;
        \q
PSQL
fi

# Instalar Nginx se não estiver instalado
if ! command -v nginx &> /dev/null; then
    echo "📦 Instalando Nginx..."
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

# Instalar PM2 globalmente se não estiver instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    sudo npm install -g pm2
fi

# Criar diretório do projeto
echo "📁 Configurando diretório do projeto..."
sudo mkdir -p /var/www/siqueira-campos-imoveis
sudo chown $USER:$USER /var/www/siqueira-campos-imoveis

# Fazer backup da versão anterior se existir
if [ -d "/var/www/siqueira-campos-imoveis/.next" ]; then
    echo "💾 Fazendo backup da versão anterior..."
    sudo cp -r /var/www/siqueira-campos-imoveis /var/backups/siqueira-campos-backup-$(date +%Y%m%d-%H%M%S)
fi

# Extrair projeto
echo "📦 Extraindo projeto..."
cd /var/www/siqueira-campos-imoveis
tar -xzf ~/project.tar.gz

# Configurar variáveis de ambiente para produção
echo "⚙️ Configurando variáveis de ambiente..."
cat > .env.local << 'ENV'
# Domínio principal
MAIN_DOMAIN=siqueiracamposimoveis.com.br
NEXTAUTH_URL=https://siqueiracamposimoveis.com.br
NEXTAUTH_SECRET=468465454567653554546524

# JWT
JWT_SECRET=468465454567653554546524
JWT_EXPIRES_IN=7d
COOKIE_SECRET=645454564867654575565

# Banco de dados
DATABASE_URL="postgresql://siqueira_user:siqueira_pass_2024@localhost:5432/site-juarez-4.0-v0?schema=public"

# Portas
PORT=3000
ADMIN_PORT=3001
APP_PORT=3002
NODE_ENV=production

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=siqueiraecamposimoveis@gmail.com
EMAIL_PASS=Juarez.123
RESEND_API_KEY=YOUR_RESEND_API_KEY # <-- Substitua pela sua chave Resend em produção

# Google OAuth
GOOGLE_CLIENT_ID=7452076957-v6740revpqo1s3f0ek25dr1tpua6q893.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://siqueiracamposimoveis.com.br/api/auth/google/callback

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Backup
BACKUP_DIR=/var/backups/siqueira-campos

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5562985563905

# Uploads
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760

# URLs de produção
SITE_URL=https://siqueiracamposimoveis.com.br
API_URL=https://siqueiracamposimoveis.com.br/api

# Configurações de segurança
CORS_ORIGIN=https://siqueiracamposimoveis.com.br
ALLOWED_ORIGINS=https://siqueiracamposimoveis.com.br,https://www.siqueiracamposimoveis.com.br,https://admin.siqueiracamposimoveis.com.br,https://app.siqueiracamposimoveis.com.br

# Desenvolvedor
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix
ENV

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --production

# Gerar cliente Prisma e aplicar migrações
echo "🗄️ Configurando banco de dados..."
npx prisma generate
npx prisma db push

# Popular banco de dados se estiver vazio
echo "📊 Populando banco de dados..."
# O script seed.ts verifica se os dados já existem antes de criar
ts-node scripts/seed.ts

# Build da aplicação
echo "🏗️ Fazendo build da aplicação..."
npm run build

# Configurar PM2
echo "⚙️ Configurando PM2..."
cat > ecosystem.config.js << 'PM2'
module.exports = {
  apps: [
    {
      name: 'siqueira-main',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/siqueira-campos-imoveis',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/siqueira-main-error.log',
      out_file: '/var/log/pm2/siqueira-main-out.log',
      log_file: '/var/log/pm2/siqueira-main.log'
    }
  ]
}
PM2

# Criar diretório de logs do PM2
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Parar aplicações existentes
pm2 delete all 2>/dev/null || true

# Iniciar aplicação com PM2
echo "🚀 Iniciando aplicação..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup | grep -E '^sudo' | bash

# Configurar Nginx
echo "🌐 Configurando Nginx..."
sudo tee /etc/nginx/sites-available/siqueiracamposimoveis << 'NGINX'
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

# Main site
server {
    listen 80;
    server_name siqueiracamposimoveis.com.br www.siqueiracamposimoveis.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Login rate limiting
    location /api/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Images caching
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1M;
        add_header Cache-Control "public";
    }
}

# Admin subdomain
server {
    listen 80;
    server_name admin.siqueiracamposimoveis.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    location / {
        proxy_pass http://localhost:3000; # Next.js handles /admin route internally
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# App subdomain
server {
    listen 80;
    server_name app.siqueiracamposimoveis.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    location / {
        proxy_pass http://localhost:3000; # Next.js handles /app route internally
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

# Ativar site no Nginx
sudo ln -sf /etc/nginx/sites-available/siqueiracamposimoveis /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "✅ Nginx configurado com sucesso!"
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi

# Configurar firewall
echo "🔒 Configurando firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Configurar backup automático
echo "💾 Configurando backup automático..."
sudo mkdir -p /var/backups/siqueira-campos

# Script de backup
sudo tee /usr/local/bin/backup-siqueira.sh << 'BACKUP'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/siqueira-campos"

# Backup do banco de dados
pg_dump "site-juarez-4.0-v0" > "$BACKUP_DIR/database_$DATE.sql"

# Backup dos arquivos da aplicação
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" -C /var/www siqueira-campos-imoveis

# Manter apenas os últimos 7 backups
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $DATE"
BACKUP

chmod +x /usr/local/bin/backup-siqueira.sh

# Configurar cron para backup diário às 2h
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-siqueira.sh") | crontab -

# Configurar SSL com Let's Encrypt
echo "🔒 Configurando SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Obter certificados SSL
sudo certbot --nginx -d siqueiracamposimoveis.com.br -d www.siqueiracamposimoveis.com.br -d admin.siqueiracamposimoveis.com.br -d app.siqueiracamposimoveis.com.br --non-interactive --agree-tos --email siqueiraecamposimoveis@gmail.com

# Configurar renovação automática
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Verificar status dos serviços
echo "🔍 Verificando status dos serviços..."
echo "PostgreSQL: $(sudo systemctl is-active postgresql)"
echo "Nginx: $(sudo systemctl is-active nginx)"
echo "PM2: $(pm2 list | grep -c online) aplicações online"

# Limpar arquivos temporários
rm -f ~/project.tar.gz

echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo ""
echo "🌐 URLs do sistema:"
echo "   Site principal: https://siqueiracamposimoveis.com.br"
echo "   Área admin: https://admin.siqueiracamposimoveis.com.br"
echo "   App mobile: https://app.siqueiracamposimoveis.com.br"
echo ""
echo "👤 Credenciais de acesso (criadas pelo script de seed):"
echo "   Owner: siqueiraecamposimoveis@gmail.com / Juarez.123"
echo "   Admin: admin@email.com / admin123"
echo "   Corretor: corretor@email.com / corretor123"
echo "   Assistente: assistente@email.com / assistente123"
echo "   Cliente: cliente@email.com / cliente123"
echo ""
echo "📊 Estatísticas do sistema (requer psql instalado no servidor):"
echo "   - $(psql -d "site-juarez-4.0-v0" -t -c "SELECT COUNT(*) FROM \"properties\";" 2>/dev/null || echo "N/A") imóveis cadastrados"
echo "   - $(psql -d "site-juarez-4.0-v0" -t -c "SELECT COUNT(*) FROM \"clients\";" 2>/dev/null || echo "N/A") leads registrados"
echo "   - $(psql -d "site-juarez-4.0-v0" -t -c "SELECT COUNT(*) FROM \"users\";" 2>/dev/null || echo "N/A") usuários no sistema"
echo ""
echo "🔧 Comandos úteis:"
echo "   Ver logs: pm2 logs"
echo "   Reiniciar app: pm2 restart all"
echo "   Status: pm2 status"
echo "   Backup manual: /usr/local/bin/backup-siqueira.sh"
echo ""
echo "📞 Suporte técnico:"
echo "   KRYONIX Development"
echo "   WhatsApp: $(grep NEXT_PUBLIC_DEVELOPER_WHATSAPP .env.local | cut -d'=' -f2)"
echo "   Instagram: $(grep NEXT_PUBLIC_DEVELOPER_INSTAGRAM .env.local | cut -d'=' -f2)"
EOF

# Limpar arquivo temporário local
rm -f project.tar.gz
rm -f .deployignore

log "Deploy concluído com sucesso!"

# Verificar se o site está respondendo
log "Verificando se o site está online..."
sleep 10

# Testar conexão HTTP
if curl -s -o /dev/null -w "%{http_code}" "http://$AWS_HOST" | grep -q "200\|301\|302"; then
    log "✅ Site está respondendo corretamente!"
else
    warning "⚠️ Site pode não estar respondendo. Verifique os logs."
fi

echo ""
echo "🎉 DEPLOY FINALIZADO COM SUCESSO!"
echo ""
echo "📋 RESUMO DO DEPLOY:"
echo "   ✅ Arquivos enviados para o servidor"
echo "   ✅ Dependências instaladas"
echo "   ✅ Banco de dados configurado"
CORS_ORIGIN=https://siqueiracamposimoveis.com.br
ALLOWED_ORIGINS=https://siqueiracamposimoveis.com.br,https://www.siqueiracamposimoveis.com.br,https://admin.siqueiracamposimoveis.com.br,https://app.siqueiracamposimoveis.com.br

# Desenvolvedor
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix
ENV

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --production

# Gerar cliente Prisma e aplicar migrações
echo "🗄️ Configurando banco de dados..."
npx prisma generate
npx prisma db push

# Popular banco de dados se estiver vazio
echo "📊 Populando banco de dados..."
# O script seed.ts verifica se os dados já existem antes de criar
ts-node scripts/seed.ts

# Build da aplicação
echo "🏗️ Fazendo build da aplicação..."
npm run build

# Configurar PM2
echo "⚙️ Configurando PM2..."
cat > ecosystem.config.js << 'PM2'
module.exports = {
  apps: [
    {
      name: 'siqueira-main',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/siqueira-campos-imoveis',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/siqueira-main-error.log',
      out_file: '/var/log/pm2/siqueira-main-out.log',
      log_file: '/var/log/pm2/siqueira-main.log'
    }
  ]
}
PM2

# Criar diretório de logs do PM2
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Parar aplicações existentes
pm2 delete all 2>/dev/null || true

# Iniciar aplicação com PM2
echo "🚀 Iniciando aplicação..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup | grep -E '^sudo' | bash

# Configurar Nginx
echo "🌐 Configurando Nginx..."
sudo tee /etc/nginx/sites-available/siqueiracamposimoveis << 'NGINX'
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

# Main site
server {
    listen 80;
    server_name siqueiracamposimoveis.com.br www.siqueiracamposimoveis.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Login rate limiting
    location /api/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Images caching
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1M;
        add_header Cache-Control "public";
    }
}

# Admin subdomain
server {
    listen 80;
    server_name admin.siqueiracamposimoveis.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    location / {
        proxy_pass http://localhost:3000; # Next.js handles /admin route internally
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# App subdomain
server {
    listen 80;
    server_name app.siqueiracamposimoveis.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    location / {
        proxy_pass http://localhost:3000; # Next.js handles /app route internally
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

# Ativar site no Nginx
sudo ln -sf /etc/nginx/sites-available/siqueiracamposimoveis /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "✅ Nginx configurado com sucesso!"
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi

# Configurar firewall
echo "🔒 Configurando firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Configurar backup automático
echo "💾 Configurando backup automático..."
sudo mkdir -p /var/backups/siqueira-campos

# Script de backup
sudo tee /usr/local/bin/backup-siqueira.sh << 'BACKUP'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/siqueira-campos"

# Backup do banco de dados
pg_dump "site-juarez-4.0-v0" > "$BACKUP_DIR/database_$DATE.sql"

# Backup dos arquivos da aplicação
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" -C /var/www siqueira-campos-imoveis

# Manter apenas os últimos 7 backups
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $DATE"
BACKUP

chmod +x /usr/local/bin/backup-siqueira.sh

# Configurar cron para backup diário às 2h
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-siqueira.sh") | crontab -

# Configurar SSL com Let's Encrypt
echo "🔒 Configurando SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Obter certificados SSL
sudo certbot --nginx -d siqueiracamposimoveis.com.br -d www.siqueiracamposimoveis.com.br -d admin.siqueiracamposimoveis.com.br -d app.siqueiracamposimoveis.com.br --non-interactive --agree-tos --email siqueiraecamposimoveis@gmail.com

# Configurar renovação automática
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Verificar status dos serviços
echo "🔍 Verificando status dos serviços..."
echo "PostgreSQL: $(sudo systemctl is-active postgresql)"
echo "Nginx: $(sudo systemctl is-active nginx)"
echo "PM2: $(pm2 list | grep -c online) aplicações online"

# Limpar arquivos temporários
rm -f ~/project.tar.gz

echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo ""
echo "🌐 URLs do sistema:"
echo "   Site principal: https://siqueiracamposimoveis.com.br"
echo "   Área admin: https://admin.siqueiracamposimoveis.com.br"
echo "   App mobile: https://app.siqueiracamposimoveis.com.br"
echo ""
echo "👤 Credenciais de acesso (criadas pelo script de seed):"
echo "   Owner: siqueiraecamposimoveis@gmail.com / Juarez.123"
echo "   Admin: admin@email.com / admin123"
echo "   Corretor: corretor@email.com / corretor123"
echo "   Assistente: assistente@email.com / assistente123"
echo "   Cliente: cliente@email.com / cliente123"
echo ""
echo "📊 Estatísticas do sistema (requer psql instalado no servidor):"
echo "   - $(psql -d "site-juarez-4.0-v0" -t -c "SELECT COUNT(*) FROM \"properties\";" 2>/dev/null || echo "N/A") imóveis cadastrados"
echo "   - $(psql -d "site-juarez-4.0-v0" -t -c "SELECT COUNT(*) FROM \"clients\";" 2>/dev/null || echo "N/A") leads registrados"
echo "   - $(psql -d "site-juarez-4.0-v0" -t -c "SELECT COUNT(*) FROM \"users\";" 2>/dev/null || echo "N/A") usuários no sistema"
echo ""
echo "🔧 Comandos úteis:"
echo "   Ver logs: pm2 logs"
echo "   Reiniciar app: pm2 restart all"
echo "   Status: pm2 status"
echo "   Backup manual: /usr/local/bin/backup-siqueira.sh"
echo ""
echo "📞 Suporte técnico:"
echo "   KRYONIX Development"
echo "   WhatsApp: $(grep NEXT_PUBLIC_DEVELOPER_WHATSAPP .env.local | cut -d'=' -f2)"
echo "   Instagram: $(grep NEXT_PUBLIC_DEVELOPER_INSTAGRAM .env.local | cut -d'=' -f2)"
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "   1. Configurar DNS para apontar para: $AWS_HOST"
echo "   2. Testar todas as funcionalidades"
echo "   3. Configurar monitoramento"
echo "   4. Treinar usuários do sistema"
echo ""
info "Deploy realizado em: $(date)"
log "Obrigado por escolher KRYONIX Development! 🚀"
