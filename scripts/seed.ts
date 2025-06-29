
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@siqueiracampos.com' },
    update: {},
    create: {
      email: 'admin@siqueiracampos.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN'
    },
  })

  console.log('✅ Usuário admin criado')

  // Criar propriedades de exemplo
  const properties = [
    {
      title: 'Casa de Alto Padrão no Centro',
      description: 'Magnífica casa com 4 quartos, piscina e área gourmet. Localizada em área nobre da cidade.',
      price: 850000,
      type: 'SALE',
      address: 'Rua das Palmeiras, 123',
      neighborhood: 'Centro',
      city: 'Juazeiro',
      state: 'BA',
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      parkingSpaces: 2,
      images: ['/imoveis/casa-alto-padrao-hero.jpg', '/placeholder.jpg'],
      featured: true,
      latitude: -9.4111,
      longitude: -40.4951
    },
    {
      title: 'Apartamento Moderno Vista Rio',
      description: 'Apartamento com vista panorâmica do Rio São Francisco. 3 quartos com suíte.',
      price: 450000,
      type: 'SALE',
      address: 'Avenida Beira Rio, 456',
      neighborhood: 'Orla',
      city: 'Juazeiro',
      state: 'BA',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      parkingSpaces: 1,
      images: ['/imoveis/casa-condominio-1.jpg', '/placeholder.jpg'],
      featured: true,
      latitude: -9.4050,
      longitude: -40.4900
    },
    {
      title: 'Casa Condomínio Fechado',
      description: 'Casa térrea em condomínio com segurança 24h, área de lazer completa.',
      price: 3500,
      type: 'RENT',
      address: 'Condomínio Ville de France, 789',
      neighborhood: 'Novo Horizonte',
      city: 'Juazeiro',
      state: 'BA',
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      parkingSpaces: 2,
      images: ['/placeholder.jpg'],
      featured: true,
      latitude: -9.4200,
      longitude: -40.5000
    }
  ]

  for (const propertyData of properties) {
    await prisma.property.upsert({
      where: { 
        title: propertyData.title 
      },
      update: {},
      create: propertyData
    })
  }

  console.log('✅ Propriedades criadas')

  // Criar depoimentos
  const testimonials = [
    {
      name: 'Maria Silva',
      content: 'Excelente atendimento! Encontrei minha casa dos sonhos com a ajuda da equipe.',
      rating: 5,
      approved: true
    },
    {
      name: 'João Santos',
      content: 'Profissionais competentes e dedicados. Recomendo para todos.',
      rating: 5,
      approved: true
    },
    {
      name: 'Ana Costa',
      content: 'Processo de compra muito tranquilo e transparente. Parabéns!',
      rating: 5,
      approved: true
    }
  ]

  for (const testimonialData of testimonials) {
    await prisma.testimonial.upsert({
      where: { 
        name: testimonialData.name 
      },
      update: {},
      create: testimonialData
    })
  }

  console.log('✅ Depoimentos criados')

  // Criar artigos do blog
  const articles = [
    {
      title: 'Como Escolher o Imóvel Ideal',
      slug: 'como-escolher-imovel-ideal',
      content: 'Guia completo para ajudar você a escolher o imóvel perfeito para sua família...',
      excerpt: 'Dicas essenciais para fazer a escolha certa na hora de comprar seu imóvel.',
      published: true,
      authorId: admin.id,
      featuredImage: '/blog/choosing-property.jpg'
    },
    {
      title: 'Tendências do Mercado Imobiliário 2024',
      slug: 'tendencias-mercado-imobiliario-2024',
      content: 'Análise das principais tendências que vão influenciar o mercado imobiliário...',
      excerpt: 'Conheça as tendências que vão moldar o mercado imobiliário em 2024.',
      published: true,
      authorId: admin.id,
      featuredImage: '/blog/market-trends.jpg'
    }
  ]

  for (const articleData of articles) {
    await prisma.article.upsert({
      where: { 
        slug: articleData.slug 
      },
      update: {},
      create: articleData
    })
  }

  console.log('✅ Artigos criados')

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
