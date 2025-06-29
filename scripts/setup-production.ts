
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

async function setupProduction() {
  console.log('🚀 Configurando ambiente de produção com SQLite...');
  
  // Criar arquivo .env.production
  const productionEnv = `
# Production Environment - SQLite
DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./production.db"

NEXTAUTH_SECRET="${process.env.NEXTAUTH_SECRET || 'production-secret-' + Math.random().toString(36)}"
NEXTAUTH_URL="${process.env.NEXTAUTH_URL || 'https://your-domain.repl.co'}"

NODE_ENV="production"
  `.trim();
  
  fs.writeFileSync('.env.production', productionEnv);
  console.log('✅ Arquivo .env.production criado');
  
  // Gerar cliente Prisma
  console.log('📦 Gerando cliente Prisma para produção...');
  
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  
  console.log('✅ Configuração de produção concluída');
}

setupProduction().catch(console.error);
