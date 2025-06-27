<#
.SYNOPSIS
    Script de deploy detalhado para o projeto Siqueira Campos Imóveis.
    Automatiza a instalação de dependências, build do projeto, e migrações de banco de dados.

.DESCRIPTION
    Este script é projetado para ser executado em ambientes de deploy (servidores, pipelines CI/CD).
    Ele garante que o ambiente esteja pronto, as dependências instaladas, o projeto construído
    e o banco de dados atualizado antes de iniciar a aplicação.

.PARAMETER Environment
    Define o ambiente de deploy (e.g., Development, Staging, Production).
    Pode ser usado para carregar configurações específicas do ambiente.

.PARAMETER SkipBuild
    Se $true, o script pulará a etapa de 'npm run build'. Útil se o build já foi feito
    em um passo anterior do pipeline de CI/CD. Padrão é $false.

.EXAMPLE
    .\deploy.ps1 -Environment Production
    Executa o deploy para o ambiente de produção, incluindo o build.

.EXAMPLE
    .\deploy.ps1 -Environment Staging -SkipBuild $true
    Executa o deploy para o ambiente de staging, pulando a etapa de build.
#>
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('Development', 'Staging', 'Production')]
    [string]$Environment,

    [Parameter(Mandatory=$false)]
    [bool]$SkipBuild = $false
)

Write-Host "Iniciando o script de deploy para o ambiente: $Environment" -ForegroundColor Green

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

# --- 2. Configuração de Variáveis de Ambiente ---
Write-Host "Configurando variáveis de ambiente para o deploy..." -ForegroundColor Cyan

# Define NODE_ENV com base no parâmetro Environment
$env:NODE_ENV = $Environment.ToLower()

# Variáveis de ambiente sensíveis devem ser configuradas no ambiente de deploy (CI/CD, sistema)
# Ex: DATABASE_URL, JWT_SECRET, BLOB_READ_WRITE_TOKEN, RESEND_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# Verifique se as variáveis críticas estão presentes
$requiredEnvVars = @(
    "DATABASE_URL",
    "JWT_SECRET",
    "BLOB_READ_WRITE_TOKEN",
    "RESEND_API_KEY", # Nova variável
    "NEXT_PUBLIC_BASE_URL" # Nova variável
)

foreach ($var in $requiredEnvVars) {
    if (-not (Get-Item Env:$var -ErrorAction SilentlyContinue)) {
        Write-Warning "Variável de ambiente '$var' não encontrada. O deploy pode falhar ou funcionalidades podem ser limitadas."
        Write-Warning "Por favor, configure '$var' no seu ambiente de deploy."
    }
}

Write-Host "Variáveis de ambiente configuradas (verifique warnings acima para chaves ausentes)." -ForegroundColor Green

# --- 3. Instalação de Dependências ---
Write-Host "Instalando dependências do projeto..." -ForegroundColor Cyan
try {
    npm install --production --loglevel verbose
    if ($LASTEXITCODE -ne 0) { throw "npm install falhou com código de saída $LASTEXITCODE." }
    Write-Host "Dependências instaladas com sucesso." -ForegroundColor Green
} catch {
    Write-Error "Erro durante a instalação das dependências: $($_.Exception.Message)"
    exit 1
}

# --- 4. Build do Projeto ---
if (-not $SkipBuild) {
    Write-Host "Iniciando o build do projeto Next.js para produção..." -ForegroundColor Cyan
    try {
        npm run build --loglevel verbose
        if ($LASTEXITCODE -ne 0) { throw "npm run build falhou com código de saída $LASTEXITCODE." }
        Write-Host "Build do projeto concluído com sucesso." -ForegroundColor Green
    } catch {
        Write-Error "Erro durante o build do projeto: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "Etapa de build pulada conforme solicitado." -ForegroundColor Yellow
}

# --- 5. Migração do Banco de Dados ---
Write-Host "Aplicando migrações do banco de dados com Prisma..." -ForegroundColor Cyan
try {
    npx prisma migrate deploy --loglevel info
    if ($LASTEXITCODE -ne 0) { throw "Prisma migrate deploy falhou com código de saída $LASTEXITCODE." }
    Write-Host "Migrações do banco de dados aplicadas com sucesso." -ForegroundColor Green
} catch {
    Write-Error "Erro durante a migração do banco de dados: $($_.Exception.Message)"
    Write-Error "Certifique-se de que DATABASE_URL está configurada corretamente e o banco de dados está acessível."
    exit 1
}

# --- 6. Limpeza (Opcional) ---
Write-Host "Realizando limpeza pós-build (opcional)..." -ForegroundColor Cyan
# Exemplo: Remover node_modules de desenvolvimento se não for necessário
# Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Limpeza concluída." -ForegroundColor Green

Write-Host ""
Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "Deploy do projeto Siqueira Campos Imóveis CONCLUÍDO!" -ForegroundColor Green
Write-Host "Ambiente: $Environment" -ForegroundColor Green
Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host ""

# --- 7. Instruções Pós-Deploy ---
Write-Host "Próximos passos para iniciar a aplicação:" -ForegroundColor Yellow
Write-Host "1. Inicie o servidor Next.js:" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "2. Para manter a aplicação rodando em segundo plano e gerenciar processos (recomendado para produção):" -ForegroundColor Yellow
Write-Host "   Considere usar um gerenciador de processos como PM2 (npm install -g pm2) ou configurar um serviço Windows." -ForegroundColor DarkYellow
Write-Host "   Exemplo com PM2:" -ForegroundColor DarkYellow
Write-Host "   pm2 start npm --name 'siqueira-campos-imoveis' -- start" -ForegroundColor DarkYellow
Write-Host "   pm2 save" -ForegroundColor DarkYellow
Write-Host "   pm2 startup" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "3. Configure um proxy reverso (Nginx, IIS, Caddy) para direcionar o tráfego do seu domínio para a porta onde o Next.js está rodando (geralmente 3000)." -ForegroundColor Yellow
Write-Host "   Isso também permitirá configurar SSL/TLS (HTTPS)." -ForegroundColor DarkYellow
Write-Host ""
Write-Host "4. Verifique os logs da aplicação para garantir que tudo está funcionando corretamente." -ForegroundColor Yellow
Write-Host "   Exemplo com PM2: pm2 logs siqueira-campos-imoveis" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "Lembre-se de que as variáveis de ambiente sensíveis devem ser configuradas no ambiente de execução do servidor." -ForegroundColor Red
