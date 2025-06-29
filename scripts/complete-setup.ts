
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Iniciando configuração completa do sistema...")

  // 1. Criar usuário admin
  console.log("1️⃣ Criando usuário administrador...")
  const adminPassword = await bcrypt.hash("admin123", 10)
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@siqueicamposimoveis.com.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@siqueicamposimoveis.com.br",
      password: adminPassword,
      role: "ADMIN"
    }
  })
  console.log("✅ Usuário admin criado:", admin.email)

  // 2. Criar corretores
  console.log("2️⃣ Criando corretores...")
  const corretores = [
    {
      name: "Maria Silva",
      email: "maria@siqueicamposimoveis.com.br",
      password: await bcrypt.hash("corretor123", 10),
      role: "AGENT" as const
    },
    {
      name: "João Santos",
      email: "joao@siqueicamposimoveis.com.br", 
      password: await bcrypt.hash("corretor123", 10),
      role: "AGENT" as const
    }
  ]

  for (const corretor of corretores) {
    await prisma.user.upsert({
      where: { email: corretor.email },
      update: {},
      create: corretor
    })
    console.log("✅ Corretor criado:", corretor.email)
  }

  // 3. Criar imóveis de exemplo em Goiânia
  console.log("3️⃣ Criando imóveis de exemplo...")
  const imoveis = [
    {
      title: "Casa em Condomínio - Alphaville Goiânia",
      description: "Belíssima casa em condomínio fechado com toda infraestrutura. 4 quartos sendo 3 suítes, área gourmet completa, piscina e jardim.",
      price: 850000,
      type: "Casa",
      address: "Rua das Acácias, 123 - Alphaville",
      city: "Goiânia",
      state: "GO",
      zipCode: "74365-000",
      bedrooms: 4,
      bathrooms: 4,
      area: 320,
      garage: true,
      pool: true,
      balcony: true,
      images: ["/imoveis/casa-condominio-1.jpg"],
      status: "FOR_SALE",
      agentId: admin.id
    },
    {
      title: "Apartamento Luxo - Setor Bueno",
      description: "Apartamento de alto padrão no coração do Setor Bueno. 3 suítes, varanda gourmet, 2 vagas de garagem.",
      price: 650000,
      type: "Apartamento",
      address: "Avenida T-4, 456 - Ed. Millennium",
      city: "Goiânia",
      state: "GO",
      zipCode: "74223-040",
      bedrooms: 3,
      bathrooms: 3,
      area: 140,
      garage: true,
      pool: false,
      balcony: true,
      images: ["/placeholder.jpg"],
      status: "FOR_SALE",
      agentId: admin.id
    },
    {
      title: "Casa Térrea - Jardim Goiás",
      description: "Casa térrea moderna com 3 quartos, área de lazer completa, churrasqueira e piscina. Excelente localização.",
      price: 480000,
      type: "Casa",
      address: "Rua C-150, 789 - Jardim Goiás",
      city: "Goiânia",
      state: "GO",
      zipCode: "74805-080",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      garage: true,
      pool: true,
      balcony: false,
      images: ["/placeholder.jpg"],
      status: "FOR_SALE",
      agentId: admin.id
    }
  ]

  for (const imovel of imoveis) {
    await prisma.property.create({ data: imovel })
    console.log("✅ Imóvel criado:", imovel.title)
  }

  // 4. Criar artigos do blog
  console.log("4️⃣ Criando artigos do blog...")
  const artigos = [
    {
      title: "Mercado Imobiliário em Goiânia: Tendências 2024",
      content: "O mercado imobiliário em Goiânia apresenta excelentes oportunidades em 2024. Analisamos as principais tendências e regiões em valorização...",
      authorId: admin.id
    },
    {
      title: "Como Escolher o Imóvel Ideal para Sua Família",
      content: "Escolher um imóvel é uma das decisões mais importantes da vida. Veja nossas dicas para fazer a escolha certa...",
      authorId: admin.id
    }
  ]

  for (const artigo of artigos) {
    await prisma.article.create({ data: artigo })
    console.log("✅ Artigo criado:", artigo.title)
  }

  // 5. Configurar IA do WhatsApp como ativada
  console.log("5️⃣ Configurando IA do WhatsApp...")
  await prisma.appSetting.upsert({
    where: { key: "whatsapp_ai_enabled" },
    update: { value: "true" },
    create: { key: "whatsapp_ai_enabled", value: "true" }
  })
  console.log("✅ IA do WhatsApp configurada")

  // 6. Criar alguns registros de exemplo para comissões e financiamentos
  console.log("6️⃣ Criando dados de exemplo para comissões...")
  const properties = await prisma.property.findMany({ take: 2 })
  
  if (properties.length > 0) {
    await prisma.commission.create({
      data: {
        propertyId: properties[0].id,
        agentId: admin.id,
        saleValue: properties[0].price,
        commissionPercentage: 6,
        commissionValue: properties[0].price * 0.06,
        type: "SALE",
        status: "PAID",
        createdBy: admin.id
      }
    })
    console.log("✅ Comissão de exemplo criada")

    await prisma.financing.create({
      data: {
        propertyId: properties[0].id,
        userId: admin.id,
        propertyValue: properties[0].price,
        downPayment: properties[0].price * 0.2,
        financedAmount: properties[0].price * 0.8,
        interestRate: 9.5,
        termMonths: 360,
        monthlyPayment: 2800.50,
        totalAmount: 1008180,
        type: "SAC",
        status: "APPROVED"
      }
    })
    console.log("✅ Financiamento de exemplo criado")
  }

  console.log("🎉 Configuração completa finalizada!")
  console.log("\n📋 Credenciais de acesso:")
  console.log("Email: admin@siqueicamposimoveis.com.br")
  console.log("Senha: admin123")
  console.log("\n🌐 Acesse: http://localhost:3000")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
