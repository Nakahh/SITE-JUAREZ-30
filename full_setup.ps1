# Script PowerShell totalmente automatizado para configurar ambiente Windows para o projeto SITE-JUAREZ-30
# Instala Docker Desktop (inclui Docker Compose), Traefik e verifica PostgreSQL

# Verifica se está rodando como administrador
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Error "Este script precisa ser executado como Administrador."
    exit 1
}

# Função para verificar se um programa está instalado
function Is-ProgramInstalled {
    param([string]$program)
    $path = (Get-Command $program -ErrorAction SilentlyContinue).Path
    return -not [string]::IsNullOrEmpty($path)
}

# Instalar Docker Desktop se não estiver instalado
if (-not (Is-ProgramInstalled "docker")) {
    Write-Output "Docker não encontrado. Instalando Docker Desktop..."
    $installerPath = "$env:TEMP\DockerDesktopInstaller.exe"
    $downloadUrl = "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe"
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath
    Start-Process -FilePath $installerPath -ArgumentList "install", "--quiet" -Wait
    Write-Output "Docker Desktop instalado. Por favor, reinicie o computador e execute este script novamente."
    exit 0
} else {
    Write-Output "Docker já está instalado."
}

# Verifica se Traefik está rodando via Docker
$traefikRunning = docker ps --filter "name=traefik" --format "{{.Names}}"
if ($traefikRunning -ne "traefik") {
    Write-Output "Traefik não está rodando. Iniciando Traefik via Docker Compose..."
    # Verifica se docker-compose.yml existe
    $composeFile = "docker-compose.yml"
    if (-not (Test-Path $composeFile)) {
        Write-Error "Arquivo docker-compose.yml não encontrado no diretório atual."
        exit 1
    }
    docker compose up -d traefik
    Write-Output "Traefik iniciado."
} else {
    Write-Output "Traefik já está rodando."
}

# Verifica se PostgreSQL está rodando via Docker
$postgresRunning = docker ps --filter "name=siquiera-postgres" --format "{{.Names}}"
if ($postgresRunning -ne "siquiera-postgres") {
    Write-Output "PostgreSQL não está rodando. Iniciando PostgreSQL via Docker Compose..."
    docker compose up -d postgres
    Write-Output "PostgreSQL iniciado."
} else {
    Write-Output "PostgreSQL já está rodando."
}

# Build e deploy do frontend
Write-Output "Construindo e iniciando o frontend..."
docker compose up -d --build frontend

Write-Output "Setup completo. Verifique se os containers estão rodando com 'docker ps'."
