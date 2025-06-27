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
        name: "Usu��rio",
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
  const existingProperty1 = await prisma.property.findFirst({
    where: { title: "Apartamento no Centro" },
  });
  if (!existingProperty1 && agent) {
    const property1 = await prisma.property.create({
      data: {
        title: "Apartamento no Centro",
        description: "Lindo apartamento com vista panorâmica",
        price: 500000,
        type: "APARTMENT",
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        address: "Rua das Flores, 123",
        city: "Siqueira Campos",
        state: "PR",
        zipCode: "86400-000",
        images: [
          "/placeholder.svg?height=500&width=700",
          "/placeholder.svg?height=100&width=150",
        ],
        agentId: agent.id,
      },
    });
    console.log("Property created:", property1.title);
  } else {
    console.log("Property already exists or agent not found");
  }

  const existingProperty2 = await prisma.property.findFirst({
    where: { title: "Casa em Condomínio" },
  });
  if (!existingProperty2 && agent) {
    const property2 = await prisma.property.create({
      data: {
        title: "Casa em Condomínio",
        description: "Casa espaçosa em condomínio fechado",
        price: 800000,
        type: "HOUSE",
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        address: "Av. Principal, 456",
        city: "Siqueira Campos",
        state: "PR",
        zipCode: "86400-000",
        images: [
          "/placeholder.svg?height=500&width=700",
          "/placeholder.svg?height=100&width=150",
        ],
        agentId: agent.id,
      },
    });
    console.log("Property created:", property2.title);
  } else {
    console.log("Property already exists or agent not found");
  }

  // Criar alguns artigos de blog de exemplo se não existirem
  const existingArticle1 = await prisma.article.findFirst({
    where: { title: "Dicas para comprar seu primeiro imóvel" },
  });
  if (!existingArticle1 && admin) {
    const article1 = await prisma.article.create({
      data: {
        title: "Dicas para comprar seu primeiro imóvel",
        content:
          "Conteúdo do artigo sobre dicas para comprar o primeiro imóvel...",
        authorId: admin.id,
      },
    });
    console.log("Article created:", article1.title);
  } else {
    console.log("Article already exists or admin not found");
  }

  const existingArticle2 = await prisma.article.findFirst({
    where: { title: "O mercado imobiliário em Siqueira Campos" },
  });
  if (!existingArticle2 && admin) {
    const article2 = await prisma.article.create({
      data: {
        title: "O mercado imobiliário em Siqueira Campos",
        content: "Conteúdo do artigo sobre o mercado imobiliário...",
        authorId: admin.id,
      },
    });
    console.log("Article created:", article2.title);
  } else {
    console.log("Article already exists or admin not found");
  }

  // Criar alguns registros financeiros de exemplo se não existirem
  const existingClient1 = await prisma.client.findFirst({
    where: { email: "cliente.exemplo@email.com" },
  });
  let clientExample;
  if (!existingClient1) {
    clientExample = await prisma.client.create({
      data: {
        name: "Cliente Exemplo",
        email: "cliente.exemplo@email.com",
        phone: "(43) 99999-9999",
        address: "Rua Exemplo, 123",
      },
    });
    console.log("Client created:", clientExample.email);
  } else {
    clientExample = existingClient1;
    console.log("Client already exists:", existingClient1.email);
  }

  const existingFinancialRecord1 = await prisma.financialRecord.findFirst({
    where: {
      type: "INCOME",
      amount: 15000,
      clientId: clientExample.id,
    },
  });
  if (!existingFinancialRecord1) {
    await prisma.financialRecord.create({
      data: {
        amount: 15000,
        type: "INCOME",
        description: "Comissão venda imóvel",
        clientId: clientExample.id,
      },
    });
    console.log("Financial record created: Income 15000");
  } else {
    console.log("Financial record already exists: Income 15000");
  }

  const existingFinancialRecord2 = await prisma.financialRecord.findFirst({
    where: {
      type: "EXPENSE",
      amount: 2000,
      clientId: clientExample.id,
    },
  });
  if (!existingFinancialRecord2) {
    await prisma.financialRecord.create({
      data: {
        amount: 2000,
        type: "EXPENSE",
        description: "Marketing digital",
        clientId: clientExample.id,
      },
    });
    console.log("Financial record created: Expense 2000");
  } else {
    console.log("Financial record already exists: Expense 2000");
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
