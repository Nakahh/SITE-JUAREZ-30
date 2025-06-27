# PowerShell script to install Docker Desktop on Windows

# Check if running as administrator
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Error "Este script precisa ser executado como Administrador."
    exit 1
}

Write-Output "Baixando instalador do Docker Desktop..."

$installerPath = "$env:TEMP\DockerDesktopInstaller.exe"
$downloadUrl = "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe"

Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath

Write-Output "Instalando Docker Desktop..."
Start-Process -FilePath $installerPath -ArgumentList "install", "--quiet" -Wait

Write-Output "Docker Desktop instalado. Reinicie o computador para finalizar a instalação."

# Optionally, start Docker Desktop after installation
# Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
