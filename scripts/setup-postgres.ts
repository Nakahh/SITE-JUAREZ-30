
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function setupPostgreSQL() {
  console.log('🐘 Configurando PostgreSQL...');
  
  try {
    // Verificar se PostgreSQL está instalado
    const psqlCheck = spawn('which', ['psql']);
    psqlCheck.on('close', (code) => {
      if (code !== 0) {
        console.log('📦 Instalando PostgreSQL...');
        installPostgreSQL();
      } else {
        console.log('✅ PostgreSQL já está instalado');
        setupDatabase();
      }
    });
  } catch (error) {
    console.error('❌ Erro ao verificar PostgreSQL:', error);
  }
}

function installPostgreSQL() {
  const install = spawn('sudo', ['apt-get', 'update', '&&', 'sudo', 'apt-get', 'install', '-y', 'postgresql', 'postgresql-contrib'], {
    stdio: 'inherit'
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ PostgreSQL instalado com sucesso');
      setupDatabase();
    } else {
      console.error('❌ Falha ao instalar PostgreSQL');
    }
  });
}

async function setupDatabase() {
  console.log('🔧 Configurando banco de dados...');
  
  // Criar usuário e banco
  const commands = [
    'sudo -u postgres createuser -s postgres',
    'sudo -u postgres createdb siqueira_imoveis_dev',
    'sudo -u postgres psql -c "ALTER USER postgres PASSWORD \'password\';"'
  ];
  
  for (const cmd of commands) {
    try {
      const [command, ...args] = cmd.split(' ');
      const process = spawn(command, args, { stdio: 'inherit' });
      await new Promise((resolve) => process.on('close', resolve));
    } catch (error) {
      console.log(`⚠️ Comando falhou (pode ser normal): ${cmd}`);
    }
  }
  
  console.log('✅ Banco de dados configurado');
}

setupPostgreSQL();
