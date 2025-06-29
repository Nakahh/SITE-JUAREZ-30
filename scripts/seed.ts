
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Verificar se já existem usuários
  const existingUsers = await prisma.user.count()
  if (existingUsers > 0) {
    console.log('✅ Banco de dados já foi populado')
    return
  }

  // Criar usuários padrão
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  console.log('👤 Criando usuários...')
  
  const owner = await prisma.user.create({
    data: {
      name: 'Siqueira Campos Imóveis',
      email: 'siqueiraecamposimoveis@gmail.com',
      password: await bcrypt.hash('Juarez.123', 10),
      role: 'OWNER',
    }
  })

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@email.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    }
  })

  const agent = await prisma.user.create({
    data: {
      name: 'Corretor',
      email: 'agent@email.com',
      password: hashedPassword,
      role: 'AGENT',
    }
  })

  const user = await prisma.user.create({
    data: {
      name: 'Usuário Teste',
      email: 'user@email.com',
      password: hashedPassword,
      role: 'USER',
    }
  })

  console.log('🏠 Criando propriedades...')
  
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: 'Casa em Condomínio de Alto Padrão',
        description: 'Linda casa com 4 quartos, 3 suítes, piscina e churrasqueira.',
        price: 850000,
        type: 'Casa',
        status: 'FOR_SALE',
        featured: true,
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        garage: true,
        pool: true,
        balcony: true,
        agentId: agent.id,
        images: '["casa-condominio-1.jpg"]'
      }
    }),
    prisma.property.create({
      data: {
        title: 'Apartamento Moderno Centro',
        description: 'Apartamento moderno no centro da cidade com 2 quartos.',
        price: 350000,
        type: 'Apartamento',
        status: 'FOR_SALE',
        featured: false,
        address: 'Av. Principal, 456',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-890',
        bedrooms: 2,
        bathrooms: 2,
        area: 80,
        garage: true,
        pool: false,
        balcony: true,
        agentId: agent.id,
      }
    })
  ])

  console.log('⚙️ Configurando aplicação...')
  
  await prisma.appSetting.createMany({
    data: [
      { key: 'whatsapp_integration_enabled', value: 'true' },
      { key: 'ai_chat_enabled', value: 'true' },
      { key: 'email_notifications_enabled', value: 'true' },
      { key: 'push_notifications_enabled', value: 'true' },
    ]
  })

  console.log('📝 Criando artigo de exemplo...')
  
  await prisma.article.create({
    data: {
      title: 'Como escolher o imóvel ideal',
      content: 'Guia completo para escolher o imóvel perfeito para sua família...',
      slug: 'como-escolher-imovel-ideal',
      published: true,
      authorId: admin.id,
    }
  })

  console.log('💰 Criando comissão de exemplo...')
  
  await prisma.commission.create({
    data: {
      propertyId: properties[0].id,
      agentId: agent.id,
      saleValue: properties[0].price,
      commissionPercentage: 6,
      commissionValue: properties[0].price * 0.06,
      type: 'SALE',
      status: 'PAID',
      createdBy: admin.id
    }
  })

  console.log('🏦 Criando financiamento de exemplo...')
  
  await prisma.financing.create({
    data: {
      propertyId: properties[0].id,
      userId: user.id,
      propertyValue: properties[0].price,
      downPayment: properties[0].price * 0.2,
      financedAmount: properties[0].price * 0.8,
      interestRate: 9.5,
      termMonths: 360,
      monthlyPayment: 2800.50,
      totalAmount: 1008180,
      type: 'SAC',
      status: 'APPROVED'
    }
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log('\n📋 Credenciais criadas:')
  console.log('Owner: siqueiraecamposimoveis@gmail.com / Juarez.123')
  console.log('Admin: admin@email.com / admin123')
  console.log('Agent: agent@email.com / 123456')
  console.log('User: user@email.com / 123456')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
