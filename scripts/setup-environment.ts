import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function setupEnvironment() {
  try {
    console.log('🔧 Configurando ambiente de desenvolvimento...');

    // Verificar se o arquivo .env existe
    const envPath = path.join(process.cwd(), '.env');
    try {
      await fs.access(envPath);
      console.log('✅ Arquivo .env encontrado');
    } catch {
      console.log('⚠️ Arquivo .env não encontrado, criando...');
      const envExample = await fs.readFile('.env.example', 'utf8');
      await fs.writeFile('.env', envExample);
      console.log('✅ Arquivo .env criado');
    }

    // Verificar se o diretório prisma existe
    const prismaDir = path.join(process.cwd(), 'prisma');
    try {
      await fs.access(prismaDir);
      console.log('✅ Diretório prisma encontrado');
    } catch {
      console.log('📁 Criando diretório prisma...');
      await fs.mkdir(prismaDir, { recursive: true });
    }

    console.log('📦 Gerando cliente Prisma...');
    try {
      await execAsync('npx prisma generate');
      console.log('✅ Cliente Prisma gerado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao gerar cliente Prisma:', error);
      throw error;
    }

    console.log('🗄️ Configurando banco de dados SQLite...');
    try {
      await execAsync('npx prisma db push');
      console.log('✅ Banco de dados SQLite configurado');
    } catch (error) {
      console.error('❌ Erro ao configurar banco de dados:', error);
      throw error;
    }

    console.log('🎉 Ambiente configurado com sucesso!');
    console.log('📱 Você pode agora executar: npm run dev');

  } catch (error) {
    console.error('❌ Erro na configuração do ambiente:', error);
    process.exit(1);
  }
}

setupEnvironment();