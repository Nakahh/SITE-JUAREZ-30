
#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

console.log('🚀 Iniciando setup completo automático do sistema...');

async function setupCompleto() {
  try {
    // 1. Configurar variáveis de ambiente
    console.log('1️⃣ Configurando ambiente...');
    if (!existsSync('.env')) {
      const envContent = `# Development Environment - PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/siqueira_imoveis_dev?schema=public"
DATABASE_PROVIDER="postgresql"
NODE_ENV="development"

# NextAuth
NEXTAUTH_SECRET="desenvolvimento-secret-kryonix-123456789"
NEXTAUTH_URL="http://localhost:3000"

# Aplicação
PORT=3000

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5562985563905

# Developer - KRYONIX
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix

# URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# IA - Configure sua chave OpenAI
OPENAI_API_KEY="your_openai_key_here"

# Email - Configure sua chave Resend
RESEND_API_KEY="your_resend_key_here"

# Uploads
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760
`;
      writeFileSync('.env', envContent);
      console.log('✅ Arquivo .env criado');
    }

    // 2. Instalar dependências
    console.log('2️⃣ Instalando dependências...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

    // 3. Gerar cliente Prisma
    console.log('3️⃣ Gerando cliente Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 4. Aplicar schema
    console.log('4️⃣ Aplicando schema do banco...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // 5. Popular banco de dados
    console.log('5️⃣ Populando banco de dados...');
    await popularBanco();

    console.log('✅ Setup completo realizado com sucesso!');
    console.log('🔧 Sistema configurado para usar PostgreSQL em desenvolvimento');
    console.log('📊 SQLite será usado em produção para simplicidade');

  } catch (error) {
    console.error('❌ Erro durante o setup:', error);
    process.exit(1);
  }
}

async function popularBanco() {
  const prisma = new PrismaClient();
  
  try {
    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@siqueicamposimoveis.com.br' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@siqueicamposimoveis.com.br',
        password: adminPassword,
        role: 'ADMIN'
      }
    });

    // Criar corretor exemplo
    const corretorPassword = await bcrypt.hash('corretor123', 10);
    await prisma.user.upsert({
      where: { email: 'corretor@siqueicamposimoveis.com.br' },
      update: {},
      create: {
        name: 'João Corretor',
        email: 'corretor@siqueicamposimoveis.com.br',
        password: corretorPassword,
        role: 'AGENT'
      }
    });

    // Criar propriedade exemplo
    await prisma.property.upsert({
      where: { id: 'exemplo-casa-1' },
      update: {},
      create: {
        id: 'exemplo-casa-1',
        title: 'Casa Exemplo - Centro',
        description: 'Linda casa no centro da cidade, próxima a todos os serviços.',
        price: 350000,
        type: 'Casa',
        status: 'FOR_SALE',
        address: 'Rua das Flores, 123',
        city: 'Siqueira Campos',
        state: 'PR',
        zipCode: '86230-000',
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        garage: true,
        pool: false,
        balcony: true,
        featured: true
      }
    });

    console.log('✅ Banco de dados populado com dados iniciais');
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupCompleto();
