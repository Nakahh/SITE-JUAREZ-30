import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Criar usuários com diferentes roles
  const hashedPasswordOwner = await bcrypt.hash("Juarez.123", 10);
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
  const hashedPasswordAgent = await bcrypt.hash("agent123", 10);
  const hashedPasswordUser = await bcrypt.hash("user123", 10);
  const hashedPasswordClient = await bcrypt.hash("client123", 10);

  // Verificar e criar Owner se não existir
  let owner = await prisma.user.findUnique({
    where: { email: "siqueiraecamposimoveis@gmail.com" },
  });
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        email: "siqueiraecamposimoveis@gmail.com",
        password: hashedPasswordOwner,
        name: "Siqueira Campos Imóveis",
        role: Role.ADMIN,
      },
    });
    console.log("Owner user created:", owner.email);
  } else {
    console.log("Owner user already exists:", owner.email);
  }

  // Verificar e criar admin se não existir
  let admin = await prisma.user.findUnique({
    where: { email: "admin@email.com" },
  });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: "admin@email.com",
        password: hashedPasswordAdmin,
        name: "Administrador",
        role: Role.ADMIN,
      },
    });
    console.log("Admin user created:", admin.email);
  } else {
    console.log("Admin user already exists:", admin.email);
  }

  // Verificar e criar agent se não existir
  let agent = await prisma.user.findUnique({
    where: { email: "agent@email.com" },
  });
  if (!agent) {
    agent = await prisma.user.create({
      data: {
        email: "agent@email.com",
        password: hashedPasswordAgent,
        name: "Corretor Goiânia",
        role: Role.AGENT,
      },
    });
    console.log("Agent user created:", agent.email);
  } else {
    console.log("Agent user already exists:", agent.email);
  }

  // Verificar e criar user se não existir
  let user = await prisma.user.findUnique({
    where: { email: "user@email.com" },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "user@email.com",
        password: hashedPasswordUser,
        name: "Usuário Cliente",
        role: Role.USER,
      },
    });
    console.log("User created:", user.email);
  } else {
    console.log("User already exists:", user.email);
  }

  // Verificar e criar cliente se não existir
  let client = await prisma.user.findUnique({
    where: { email: "client@email.com" },
  });
  if (!client) {
    client = await prisma.user.create({
      data: {
        email: "client@email.com",
        password: hashedPasswordClient,
        name: "Cliente Goiânia",
        role: Role.CLIENT,
      },
    });
    console.log("Client user created:", client.email);
  } else {
    console.log("Client user already exists:", client.email);
  }

  // DELETAR PROPRIEDADES ANTIGAS E RECRIAR COM DADOS DE GOIÂNIA
  await prisma.property.deleteMany({});
  console.log("Deleted old properties");

  // Criar imóveis de Goiânia com imagens reais
  if (agent) {
    const property1 = await prisma.property.create({
      data: {
        title: "Apartamento no Setor Bueno",
        description:
          "Moderno apartamento com vista panorâmica no coração de Goiânia. Próximo ao Flamboyant Shopping e principais avenidas.",
        price: 580000,
        type: "APARTMENT",
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        address: "Rua T-28, 456 - Setor Bueno",
        city: "Goiânia",
        state: "GO",
        zipCode: "74210-010",
        images: [
          "https://images.pexels.com/photos/7147286/pexels-photo-7147286.jpeg",
          "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
        ],
        agentId: agent.id,
      },
    });
    console.log("Property created:", property1.title);

    const property2 = await prisma.property.create({
      data: {
        title: "Casa em Condomínio no Jardins",
        description:
          "Lindíssima casa em condomínio fechado no Jardins Goiânia. Área de lazer completa, segurança 24h.",
        price: 950000,
        type: "HOUSE",
        bedrooms: 4,
        bathrooms: 3,
        area: 280,
        address: "Rua das Palmeiras, 123 - Jardins Goiânia",
        city: "Goiânia",
        state: "GO",
        zipCode: "74430-090",
        images: [
          "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
          "https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg",
        ],
        agentId: agent.id,
      },
    });
    console.log("Property created:", property2.title);

    const property3 = await prisma.property.create({
      data: {
        title: "Cobertura no Setor Oeste",
        description:
          "Cobertura luxuosa no Setor Oeste com terraço gourmet e vista da cidade. Acabamento de primeira qualidade.",
        price: 1200000,
        type: "APARTMENT",
        bedrooms: 4,
        bathrooms: 4,
        area: 200,
        address: "Avenida T-7, 890 - Setor Oeste",
        city: "Goiânia",
        state: "GO",
        zipCode: "74120-060",
        images: [
          "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg",
          "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
        ],
        agentId: agent.id,
      },
    });
    console.log("Property created:", property3.title);
  }

  // Criar artigos sobre o mercado imobiliário de Goiânia
  const existingArticle1 = await prisma.article.findFirst({
    where: { title: "Mercado Imobiliário em Goiânia: Tendências 2024" },
  });
  if (!existingArticle1 && admin) {
    const article1 = await prisma.article.create({
      data: {
        title: "Mercado Imobiliário em Goiânia: Tendências 2024",
        content:
          "O mercado imobiliário de Goiânia continua aquecido em 2024, com crescimento nos setores Bueno, Oeste e Jardins. A cidade tem se destacado no cenário nacional pela qualidade de vida e oportunidades de investimento.",
        authorId: admin.id,
      },
    });
    console.log("Article created:", article1.title);
  }

  const existingArticle2 = await prisma.article.findFirst({
    where: { title: "Melhores Bairros para Investir em Goiânia" },
  });
  if (!existingArticle2 && admin) {
    const article2 = await prisma.article.create({
      data: {
        title: "Melhores Bairros para Investir em Goiânia",
        content:
          "Conheça os bairros com maior potencial de valorização em Goiânia: Jardins, Setor Bueno, Alto da Glória, Setor Oeste e região do Parque Flamboyant. Estes bairros combinam infraestrutura moderna e valorização imobiliária.",
        authorId: admin.id,
      },
    });
    console.log("Article created:", article2.title);
  }

  // Criar cliente exemplo de Goiânia
  const existingClient = await prisma.client.findFirst({
    where: { email: "cliente.goiania@email.com" },
  });
  if (!existingClient) {
    const clientExample = await prisma.client.create({
      data: {
        name: "Maria Silva",
        email: "cliente.goiania@email.com",
        phone: "(62) 99999-8888",
        address: "Setor Central, Goiânia, GO",
      },
    });
    console.log("Client created:", clientExample.name);
  }

  // Criar registros financeiros de exemplo (comentados - precisam de schema correto)
  // const existingFinancial1 = await prisma.financialRecord.findFirst({
  //   where: { description: "Venda Apartamento Setor Bueno" },
  // });
  // if (!existingFinancial1) {
  //   const financial1 = await prisma.financialRecord.create({
  //     data: {
  //       description: "Venda Apartamento Setor Bueno",
  //       amount: 580000,
  //       type: "INCOME",
  //       date: new Date(),
  //     },
  //   });
  //   console.log("Financial record created:", financial1.description);
  // }

  console.log("✅ Seed concluído com dados de Goiânia!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
