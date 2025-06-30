import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Usuário admin
    const adminPassword = await bcrypt.hash("123456", 10);
    await prisma.user.upsert({
      where: { email: "admin@siqueiracampos.com" },
      update: {},
      create: {
        name: "Administrador",
        email: "admin@siqueiracampos.com",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    // Usuário comum
    const userPassword = await bcrypt.hash("123456", 10);
    await prisma.user.upsert({
      where: { email: "usuario@teste.com" },
      update: {},
      create: {
        name: "Usuário Teste",
        email: "usuario@teste.com",
        password: userPassword,
        role: "USER",
      },
    });

    // Corretor
    const agentPassword = await bcrypt.hash("123456", 10);
    await prisma.user.upsert({
      where: { email: "corretor@siqueiracampos.com" },
      update: {},
      create: {
        name: "João Silva",
        email: "corretor@siqueiracampos.com",
        password: agentPassword,
        role: "AGENT",
      },
    });

    console.log("✅ Usuários de teste criados com sucesso!");
    console.log("📧 Credenciais:");
    console.log("Admin: admin@siqueiracampos.com / 123456");
    console.log("Usuário: usuario@teste.com / 123456");
    console.log("Corretor: corretor@siqueiracampos.com / 123456");
  } catch (error) {
    console.error("❌ Erro ao criar usuários:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
