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
        name: "Owner Siqueira Campos",
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
        name: "Corretor",
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
        name: "Usuário",
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
        name: "Cliente",
        role: Role.CLIENT,
      },
    });
    console.log("Client user created:", client.email);
  } else {
    console.log("Client user already exists:", client.email);
  }

  // Criar alguns imóveis de exemplo se não existirem
  const existingImovel1 = await prisma.property.findFirst({
    where: { titulo: "Apartamento no Centro" },
  });
  if (!existingImovel1) {
    const imovel1 = await prisma.property.create({
      data: {
        titulo: "Apartamento no Centro",
        descricao: "Lindo apartamento com vista panorâmica",
        preco: 500000,
        tipo: "Apartamento",
        quartos: 3,
        area: 120,
        localizacao: "Centro",
        imageUrls: [
          "/placeholder.svg?height=500&width=700",
          "/placeholder.svg?height=100&width=150",
        ],
      },
    });
    console.log("Property created:", imovel1.titulo);
  } else {
    console.log("Property already exists:", existingImovel1.titulo);
  }

  const existingImovel2 = await prisma.property.findFirst({
    where: { titulo: "Casa em Condomínio" },
  });
  if (!existingImovel2) {
    const imovel2 = await prisma.property.create({
      data: {
        titulo: "Casa em Condomínio",
        descricao: "Casa espaçosa em condomínio fechado",
        preco: 800000,
        tipo: "Casa",
        quartos: 4,
        area: 250,
        localizacao: "Condomínio",
        imageUrls: [
          "/placeholder.svg?height=500&width=700",
          "/placeholder.svg?height=100&width=150",
        ],
      },
    });
    console.log("Property created:", imovel2.titulo);
  } else {
    console.log("Property already exists:", existingImovel2.titulo);
  }

  // Criar alguns artigos de blog de exemplo se não existirem
  const existingArtigo1 = await prisma.article.findFirst({
    where: { slug: "dicas-para-comprar-seu-primeiro-imovel" },
  });
  if (!existingArtigo1) {
    const artigo1 = await prisma.article.create({
      data: {
        titulo: "Dicas para comprar seu primeiro imóvel",
        slug: "dicas-para-comprar-seu-primeiro-imovel",
        conteudo: "Conteúdo do artigo...",
      },
    });
    console.log("Article created:", artigo1.titulo);
  } else {
    console.log("Article already exists:", existingArtigo1.titulo);
  }

  const existingArtigo2 = await prisma.article.findFirst({
    where: { slug: "o-mercado-imobiliario-em-siqueira-campos" },
  });
  if (!existingArtigo2) {
    const artigo2 = await prisma.article.create({
      data: {
        titulo: "O mercado imobiliario em Siqueira Campos",
        slug: "o-mercado-imobiliario-em-siqueira-campos",
        conteudo: "Conteúdo do artigo...",
      },
    });
    console.log("Article created:", artigo2.titulo);
  } else {
    console.log("Article already exists:", existingArtigo2.titulo);
  }

  // Criar alguns registros financeiros de exemplo se não existirem
  const existingFinancialRecord1 = await prisma.financialRecord.findFirst({
    where: { tipo: "Receita", valor: 15000 },
  });
  if (!existingFinancialRecord1) {
    await prisma.financialRecord.create({
      data: {
        valor: 15000,
        tipo: "Receita",
      },
    });
    console.log("Financial record created: Receita 15000");
  } else {
    console.log("Financial record already exists: Receita 15000");
  }

  const existingFinancialRecord2 = await prisma.financialRecord.findFirst({
    where: { tipo: "Despesa", valor: 2000 },
  });
  if (!existingFinancialRecord2) {
    await prisma.financialRecord.create({
      data: {
        valor: 2000,
        tipo: "Despesa",
      },
    });
    console.log("Financial record created: Despesa 2000");
  } else {
    console.log("Financial record already exists: Despesa 2000");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
