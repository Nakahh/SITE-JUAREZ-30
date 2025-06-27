<#
.SYNOPSIS
    Script de configuração inicial para o ambiente de desenvolvimento local do projeto Siqueira Campos Imóveis.

.DESCRIPTION
    Este script automatiza os passos iniciais para colocar o projeto em funcionamento no seu ambiente local.
    Ele verifica pré-requisitos, instala dependências e configura o banco de dados.

.EXAMPLE
    .\setup-local.ps1
    Executa a configuração completa do ambiente de desenvolvimento local.
#>

Write-Host "Iniciando o script de configuração do ambiente de desenvolvimento local..." -ForegroundColor Green

# --- 1. Verificação de Pré-requisitos ---
Write-Host "Verificando pré-requisitos..." -ForegroundColor Cyan

# Função para verificar se um comando existe
function Test-CommandExists {
    param([string]$Command)
    (Get-Command $Command -ErrorAction SilentlyContinue) -ne $null
}

if (-not (Test-CommandExists "node")) {
    Write-Error "Node.js não encontrado. Por favor, instale o Node.js (versão 18 ou superior)."
    exit 1
}
if (-not (Test-CommandExists "npm")) {
    Write-Error "npm não encontrado. Por favor, instale o npm (geralmente vem com o Node.js)."
    exit 1
}
if (-not (Test-CommandExists "git")) {
    Write-Error "Git não encontrado. Por favor, instale o Git."
    exit 1
}

Write-Host "Pré-requisitos verificados com sucesso." -ForegroundColor Green

# --- 2. Instalação de Dependências ---
Write-Host "Instalando dependências do projeto..." -ForegroundColor Cyan
try {
    npm install --loglevel verbose
    if ($LASTEXITCODE -ne 0) { throw "npm install falhou com código de saída $LASTEXITCODE." }
    Write-Host "Dependências instaladas com sucesso." -ForegroundColor Green
} catch {
    Write-Error "Erro durante a instalação das dependências: $($_.Exception.Message)"
    exit 1
}

# --- 3. Configuração do Banco de Dados ---
Write-Host "Configurando o banco de dados com Prisma..." -ForegroundColor Cyan

# Verifica se o arquivo .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Warning "Arquivo '.env.local' não encontrado. Criando um arquivo de exemplo."
    # Cria um .env.local básico se não existir
    @"
# Variáveis de Ambiente para o Projeto Siqueira Campos Imóveis

# Configurações do Banco de Dados (PostgreSQL)
# Exemplo para desenvolvimento local com PostgreSQL (Docker/local install)
DATABASE_URL="postgresql://user:password@localhost:5432/siqueiracamposdb?schema=public"
POSTGRES_URL="postgresql://user:password@localhost:5432/siqueiracamposdb?schema=public"
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/siqueiracamposdb?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/siqueiracamposdb?schema=public"
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="siqueiracamposdb"
POSTGRES_HOST="localhost"

# Configurações do NextAuth.js
# Gere uma chave secreta longa e aleatória, por exemplo, com `openssl rand -base64 32`
JWT_SECRET="sua_chave_secreta_jwt_aqui_gerada_aleatoriamente"

# Google OAuth Provider (Opcional, para login com Google)
# Obtenha em console.developers.google.com
GOOGLE_CLIENT_ID="SEU_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="SEU_GOOGLE_CLIENT_SECRET"

# Vercel Blob Storage (Para upload de imagens de imóveis)
# Obtenha em app.vercel.com/new/blob
BLOB_READ_WRITE_TOKEN="YOUR_VERCEL_BLOB_READ_WRITE_TOKEN"

# Resend API Key (Para envio de e-mails de notificação e confirmação)
# Obtenha em resend.com
# Se não configurado, os e-mails serão logados no console.
RESEND_API_KEY="YOUR_RESEND_API_KEY"

# URL Base do Site (Usado para links em e-mails, sitemap, etc.)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Google Maps API Key (Opcional, para mapas mais interativos ou funcionalidades avançadas)
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "Arquivo '.env.local' criado com valores padrão. Por favor, revise e atualize-o com suas credenciais." -ForegroundColor Yellow
}

Write-Host "Executando 'npx prisma db push' para sincronizar o schema do banco de dados..." -ForegroundColor Cyan
try {
    npx prisma db push --loglevel info
    if ($LASTEXITCODE -ne 0) { throw "Prisma db push falhou com código de saída $LASTEXITCODE." }
    Write-Host "Schema do banco de dados sincronizado com sucesso." -ForegroundColor Green
} catch {
    Write-Error "Erro durante 'npx prisma db push': $($_.Exception.Message)"
    Write-Error "Certifique-se de que seu servidor PostgreSQL está rodando e a DATABASE_URL em '.env.local' está correta."
    exit 1
}

Write-Host ""
Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "Configuração do ambiente local CONCLUÍDA!" -ForegroundColor Green
Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. **Revise o arquivo '.env.local'** e preencha todas as variáveis de ambiente com suas credenciais reais (JWT_SECRET, GOOGLE_CLIENT_ID/SECRET, BLOB_READ_WRITE_TOKEN, RESEND_API_KEY, NEXT_PUBLIC_BASE_URL)." -ForegroundColor Yellow
Write-Host "   - Para JWT_SECRET, você pode gerar uma com `openssl rand -base64 32` no terminal Git Bash ou WSL." -ForegroundColor DarkYellow
Write-Host "   - Para BLOB_READ_WRITE_TOKEN, crie uma conta Vercel e adicione a integração Vercel Blob." -ForegroundColor DarkYellow
Write-Host "   - Para RESEND_API_KEY, crie uma conta e um domínio verificado em resend.com." -ForegroundColor DarkYellow
Write-Host "   - Para GOOGLE_CLIENT_ID/SECRET, crie um projeto no Google Cloud Console e configure as credenciais OAuth 2.0." -ForegroundColor DarkYellow
Write-Host ""
Write-Host "2. Inicie o servidor de desenvolvimento:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "3. Acesse o aplicativo em seu navegador: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Se encontrar problemas, consulte a seção 'Solução de Problemas' no README.md." -ForegroundColor Yellow
