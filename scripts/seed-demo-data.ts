import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed dos dados de demonstração...");

  // Criar usuários de demonstração
  const users = [
    {
      email: "admin@siqueiracampos.com",
      name: "Administrador Sistema",
      password: await bcrypt.hash("123456", 12),
      role: "ADMIN",
      ativo: true,
      whatsapp: "5562985563905",
    },
    {
      email: "corretor@siqueiracampos.com",
      name: "João Silva Corretor",
      password: await bcrypt.hash("123456", 12),
      role: "AGENT",
      ativo: true,
      whatsapp: "5562999888777",
    },
    {
      email: "corretor2@siqueiracampos.com",
      name: "Maria Santos Corretor",
      password: await bcrypt.hash("123456", 12),
      role: "AGENT",
      ativo: true,
      whatsapp: "5562888777666",
    },
    {
      email: "usuario@teste.com",
      name: "Cliente Teste",
      password: await bcrypt.hash("123456", 12),
      role: "USER",
      ativo: false,
    },
  ];

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: userData,
      });
      console.log(`✅ Usuário criado: ${userData.email} (${userData.role})`);
    } else {
      console.log(`⚠️ Usuário já existe: ${userData.email}`);
    }
  }

  // Criar imóveis de demonstração
  const admin = await prisma.user.findUnique({
    where: { email: "admin@siqueiracampos.com" },
  });

  const corretor1 = await prisma.user.findUnique({
    where: { email: "corretor@siqueiracampos.com" },
  });

  const properties = [
    {
      title: "Apartamento Moderno no Centro",
      description:
        "Lindo apartamento de 2 quartos com vista para o parque, localizado no coração da cidade. Completamente reformado com acabamentos de primeira linha.",
      price: 350000,
      type: "Apartamento",
      status: "FOR_SALE",
      featured: true,
      address: "Rua das Flores, 123",
      city: "Goiânia",
      state: "Goiás",
      zipCode: "74000-000",
      bedrooms: 2,
      bathrooms: 2,
      area: 75.5,
      garage: true,
      pool: false,
      balcony: true,
      agentId: corretor1?.id,
      images: [
        "/placeholder-property.svg",
        "/placeholder-property.svg",
        "/placeholder-property.svg",
      ],
    },
    {
      title: "Casa Familiar no Jardim América",
      description:
        "Espaçosa casa de 3 quartos com quintal amplo, perfeita para famílias. Localizada em bairro residencial tranquilo.",
      price: 550000,
      type: "Casa",
      status: "FOR_SALE",
      featured: true,
      address: "Av. Brasil, 456",
      city: "Goiânia",
      state: "Goiás",
      zipCode: "74100-000",
      bedrooms: 3,
      bathrooms: 3,
      area: 180.0,
      garage: true,
      pool: true,
      balcony: false,
      agentId: admin?.id,
      images: ["/placeholder-property.svg", "/placeholder-property.svg"],
    },
    {
      title: "Cobertura Luxuosa com Piscina",
      description:
        "Magnífica cobertura duplex com piscina privativa e vista panorâmica da cidade. O máximo em sofisticação e conforto.",
      price: 980000,
      type: "Cobertura",
      status: "FOR_SALE",
      featured: true,
      address: "Rua Elegante, 789",
      city: "Goiânia",
      state: "Goiás",
      zipCode: "74200-000",
      bedrooms: 4,
      bathrooms: 4,
      area: 250.0,
      garage: true,
      pool: true,
      balcony: true,
      agentId: corretor1?.id,
      images: ["/placeholder-property.svg"],
    },
    {
      title: "Apartamento para Locação",
      description:
        "Apartamento mobiliado de 1 quarto, ideal para estudantes ou profissionais solteiros. Próximo ao shopping.",
      price: 1200,
      type: "Apartamento",
      status: "FOR_RENT",
      featured: false,
      address: "Rua Estudantil, 321",
      city: "Goiânia",
      state: "Goiás",
      zipCode: "74300-000",
      bedrooms: 1,
      bathrooms: 1,
      area: 45.0,
      garage: false,
      pool: false,
      balcony: false,
      agentId: admin?.id,
      images: ["/placeholder-property.svg", "/placeholder-property.svg"],
    },
    {
      title: "Casa de Campo com Área Rural",
      description:
        "Linda casa de campo com 5000m² de terreno, ideal para quem busca tranquilidade e contato com a natureza.",
      price: 750000,
      type: "Casa",
      status: "FOR_SALE",
      featured: false,
      address: "Estrada Rural, Km 12",
      city: "Aparecida de Goiânia",
      state: "Goiás",
      zipCode: "74900-000",
      bedrooms: 4,
      bathrooms: 3,
      area: 200.0,
      garage: true,
      pool: false,
      balcony: true,
      agentId: corretor1?.id,
      images: ["/placeholder-property.svg"],
    },
  ];

  for (const propertyData of properties) {
    const existingProperty = await prisma.property.findFirst({
      where: { title: propertyData.title },
    });

    if (!existingProperty) {
      await prisma.property.create({
        data: propertyData,
      });
      console.log(`🏠 Imóvel criado: ${propertyData.title}`);
    } else {
      console.log(`⚠️ Imóvel já existe: ${propertyData.title}`);
    }
  }

  // Criar artigos de blog
  const articles = [
    {
      title: "Como Escolher o Imóvel Ideal para sua Família",
      content:
        "Escolher um imóvel é uma das decisões mais importantes da vida. Neste artigo, vamos te ajudar a entender os principais fatores a considerar...",
      slug: "como-escolher-imovel-ideal",
      published: true,
      authorId: admin?.id,
    },
    {
      title: "Tendências do Mercado Imobiliário em 2024",
      content:
        "O mercado imobiliário está em constante evolução. Descubra as principais tendências que estão moldando o setor...",
      slug: "tendencias-mercado-imobiliario-2024",
      published: true,
      authorId: corretor1?.id,
    },
    {
      title: "Dicas para Financiar seu Primeiro Imóvel",
      content:
        "Financiar um imóvel pode parecer complexo, mas com as informações certas você pode realizar o sonho da casa própria...",
      slug: "dicas-financiar-primeiro-imovel",
      published: true,
      authorId: admin?.id,
    },
  ];

  for (const articleData of articles) {
    const existingArticle = await prisma.article.findUnique({
      where: { slug: articleData.slug },
    });

    if (!existingArticle && articleData.authorId) {
      await prisma.article.create({
        data: articleData,
      });
      console.log(`📝 Artigo criado: ${articleData.title}`);
    } else {
      console.log(`⚠️ Artigo já existe: ${articleData.title}`);
    }
  }

  // Criar depoimentos
  const testimonials = [
    {
      userId: await prisma.user
        .findUnique({ where: { email: "usuario@teste.com" } })
        .then((u) => u?.id),
      content:
        "Excelente atendimento! A equipe da Siqueira Campos me ajudou a encontrar o apartamento perfeito. Super recomendo!",
      rating: 5,
      approved: true,
    },
    {
      userId: await prisma.user
        .findUnique({ where: { email: "usuario@teste.com" } })
        .then((u) => u?.id),
      content:
        "Profissionais muito competentes e atenciosos. Todo o processo de compra foi tranquilo e bem orientado.",
      rating: 5,
      approved: true,
    },
  ];

  for (const testimonialData of testimonials) {
    if (testimonialData.userId) {
      const existingTestimonial = await prisma.testimonial.findFirst({
        where: {
          userId: testimonialData.userId,
          content: testimonialData.content,
        },
      });

      if (!existingTestimonial) {
        await prisma.testimonial.create({
          data: testimonialData,
        });
        console.log(`⭐ Depoimento criado`);
      }
    }
  }

  console.log("✅ Seed de dados de demonstração concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
