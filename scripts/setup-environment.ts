
import { spawn } from 'child_process';
import fs from 'fs';

async function setupEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log(`🔧 Configurando ambiente: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
  
  if (isProduction) {
    // Configuração para produção (SQLite)
    console.log('📱 Usando SQLite para produção...');
    
    if (!fs.existsSync('.env.production')) {
      const envContent = `DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./production.db"
NEXTAUTH_SECRET="${generateSecret()}"
NEXTAUTH_URL="https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co"
NODE_ENV="production"`;
      
      fs.writeFileSync('.env.production', envContent);
      console.log('✅ Arquivo .env.production criado');
    }
  } else {
    // Configuração para desenvolvimento (PostgreSQL)
    console.log('🐘 Usando PostgreSQL para desenvolvimento...');
    
    if (!fs.existsSync('.env')) {
      const envContent = `DATABASE_PROVIDER="postgresql"
DATABASE_URL="postgresql://postgres:password@localhost:5432/siqueira_imoveis_dev?schema=public"
NEXTAUTH_SECRET="${generateSecret()}"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"`;
      
      fs.writeFileSync('.env', envContent);
      console.log('✅ Arquivo .env criado');
    }
    
    // Tentar configurar PostgreSQL
    await setupPostgreSQL();
  }
  
  // Gerar cliente Prisma
  console.log('📦 Gerando cliente Prisma...');
  await runCommand('npx', ['prisma', 'generate']);
  
  // Aplicar migrações
  console.log('🔄 Aplicando migrações...');
  if (isProduction) {
    await runCommand('npx', ['prisma', 'db', 'push']);
  } else {
    await runCommand('npx', ['prisma', 'migrate', 'dev']);
  }
  
  console.log('✅ Ambiente configurado com sucesso!');
}

async function setupPostgreSQL() {
  try {
    console.log('🐘 Configurando PostgreSQL...');
    
    // Para Replit, usamos comandos específicos
    const commands = [
      ['sudo', ['service', 'postgresql', 'start']],
      ['sudo', ['-u', 'postgres', 'createdb', 'siqueira_imoveis_dev']],
      ['sudo', ['-u', 'postgres', 'psql', '-c', "ALTER USER postgres PASSWORD 'password';"]]
    ];
    
    for (const [cmd, args] of commands) {
      try {
        await runCommand(cmd, args);
      } catch (error) {
        console.log(`⚠️ Comando ${cmd} falhou (pode ser normal)`);
      }
    }
    
    console.log('✅ PostgreSQL configurado');
  } catch (error) {
    console.log('⚠️ Erro ao configurar PostgreSQL, usando SQLite como fallback');
    
    // Fallback para SQLite em desenvolvimento
    const envContent = `DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="${generateSecret()}"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"`;
    
    fs.writeFileSync('.env', envContent);
  }
}

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

function generateSecret(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

setupEnvironment().catch(console.error);
