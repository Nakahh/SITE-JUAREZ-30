
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@siqueiracampos.com' },
    update: {},
    create: {
      email: 'admin@siqueiracampos.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'OWNER',
      phone: '(11) 99999-9999'
    }
  });

  // Criar agente
  const agent = await prisma.user.upsert({
    where: { email: 'corretor@siqueiracampos.com' },
    update: {},
    create: {
      email: 'corretor@siqueiracampos.com',
      name: 'João Silva',
      password: hashedPassword,
      role: 'AGENT',
      phone: '(11) 98888-8888'
    }
  });

  // Criar propriedades com imagens
  const properties = [
    {
      title: 'Casa Moderna em Condomínio Fechado',
      description: 'Belíssima casa em condomínio de alto padrão, com área de lazer completa, segurança 24h e localização privilegiada.',
      price: 850000,
      address: 'Rua das Flores, 123',
      neighborhood: 'Jardim Botânico',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      parking: 2,
      type: 'HOUSE',
      saleType: 'SALE',
      amenities: ['Piscina', 'Churrasqueira', 'Área de lazer', 'Playground', 'Quadra esportiva'],
      images: ['/imoveis/casa-condominio-1.jpg', '/imoveis/luxury-property-hero.jpg']
    },
    {
      title: 'Apartamento Duplex com Vista Panorâmica',
      description: 'Apartamento duplex com vista deslumbrante da cidade, acabamento de primeira e localização nobre.',
      price: 650000,
      address: 'Avenida Paulista, 1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      parking: 1,
      type: 'APARTMENT',
      saleType: 'SALE',
      amenities: ['Academia', 'Salão de festas', 'Piscina', 'Sauna'],
      images: ['/imoveis/luxury-property-hero.jpg', '/imoveis/casa-condominio-1.jpg']
    },
    {
      title: 'Casa com Piscina para Locação',
      description: 'Casa espaçosa com piscina, jardim amplo e área gourmet. Perfeita para famílias.',
      price: 3500,
      address: 'Rua do Lago, 456',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05433-000',
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      parking: 2,
      type: 'HOUSE',
      saleType: 'RENT',
      amenities: ['Piscina', 'Jardim', 'Área gourmet', 'Churrasqueira'],
      images: ['/imoveis/casa-alto-padrao-hero.jpg', '/imoveis/luxury-property-hero.jpg']
    }
  ];

  for (const propertyData of properties) {
    const { images, amenities, ...propertyInfo } = propertyData;
    
    const property = await prisma.property.create({
      data: {
        ...propertyInfo,
        amenities: JSON.stringify(amenities),
        agentId: agent.id
      }
    });

    // Criar imagens para cada propriedade
    for (let i = 0; i < images.length; i++) {
      await prisma.propertyImage.create({
        data: {
          url: images[i],
          alt: `${propertyData.title} - Imagem ${i + 1}`,
          order: i,
          propertyId: property.id
        }
      });
    }
  }

  // Criar depoimentos
  const testimonials = [
    {
      name: 'Maria Santos',
      role: 'Compradora',
      content: 'Excelente atendimento! A equipe da Siqueira Campos me ajudou a encontrar a casa dos meus sonhos. Muito profissionalismo e dedicação.',
      rating: 5,
      image: '/testimonials/client-1.jpg'
    },
    {
      name: 'Carlos Oliveira',
      role: 'Vendedor',
      content: 'Venderam meu apartamento em tempo recorde! Processo transparente e sem complicações. Super recomendo!',
      rating: 5,
      image: '/testimonials/client-2.jpg'
    },
    {
      name: 'Ana Paula',
      role: 'Locatária',
      content: 'Encontrei o apartamento perfeito para alugar. Atendimento personalizado e muita agilidade no processo.',
      rating: 5,
      image: '/testimonials/client-3.jpg'
    }
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${testimonial.name.toLowerCase().replace(' ', '-')}` },
      update: {},
      create: {
        id: `testimonial-${testimonial.name.toLowerCase().replace(' ', '-')}`,
        ...testimonial
      }
    });
  }

  // Criar artigos do blog
  const articles = [
    {
      title: 'Como Escolher o Imóvel Ideal para sua Família',
      slug: 'como-escolher-imovel-ideal-familia',
      content: 'Escolher um imóvel é uma das decisões mais importantes da vida. Neste artigo, compartilhamos dicas valiosas para ajudá-lo a fazer a melhor escolha...',
      excerpt: 'Dicas essenciais para escolher o imóvel perfeito para sua família.',
      featuredImage: '/blog/choosing-property.jpg',
      published: true,
      publishedAt: new Date()
    },
    {
      title: 'Investir em Imóveis: Guia Completo para Iniciantes',
      slug: 'investir-imoveis-guia-completo',
      content: 'O mercado imobiliário oferece excelentes oportunidades de investimento. Descubra como começar e maximizar seus retornos...',
      excerpt: 'Tudo que você precisa saber sobre investimento imobiliário.',
      featuredImage: '/blog/real-estate-investment.jpg',
      published: true,
      publishedAt: new Date()
    }
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article
    });
  }

  // Configurações da aplicação
  await prisma.appSettings.upsert({
    where: { id: 'main-settings' },
    update: {},
    create: {
      id: 'main-settings',
      siteName: 'Siqueira Campos Imóveis',
      siteDescription: 'Sua imobiliária de confiança desde 2009',
      primaryColor: '#d97706',
      secondaryColor: '#f59e0b',
      phone: '(11) 3456-7890',
      whatsapp: '5511999887766',
      email: 'contato@siqueiracampos.com',
      address: 'Rua Principal, 123 - Centro - São Paulo/SP',
      socialMedia: JSON.stringify({
        facebook: 'https://facebook.com/siqueiracampos',
        instagram: 'https://instagram.com/siqueiracampos',
        youtube: 'https://youtube.com/siqueiracampos'
      })
    }
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log(`👤 Admin criado: admin@siqueiracampos.com / admin123`);
  console.log(`👨‍💼 Agente criado: corretor@siqueiracampos.com / admin123`);
  console.log(`🏠 ${properties.length} propriedades criadas`);
  console.log(`💬 ${testimonials.length} depoimentos criados`);
  console.log(`📄 ${articles.length} artigos criados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
