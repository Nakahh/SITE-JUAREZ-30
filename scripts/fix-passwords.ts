import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db",
    },
  },
});

async function fixPasswords() {
  try {
    console.log("🔧 Corrigindo senhas dos usuários...\n");

    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔑 Nova senha hash gerada:", hashedPassword);
    console.log(
      "🧪 Testando hash:",
      await bcrypt.compare(password, hashedPassword),
    );
    console.log("");

    // Atualizar todos os usuários de teste
    const testUsers = [
      {
        email: "admin@siqueiracampos.com",
        name: "Administrador",
        role: "ADMIN",
      },
      {
        email: "corretor@siqueiracampos.com",
        name: "João Silva",
        role: "AGENT",
      },
      { email: "usuario@teste.com", name: "Usuário Teste", role: "USER" },
    ];

    for (const userData of testUsers) {
      console.log(`🔄 Atualizando ${userData.email}...`);

      await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          password: hashedPassword,
          name: userData.name,
        },
        create: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role as any,
        },
      });

      console.log(`✅ ${userData.email} atualizado`);
    }

    console.log("\n🎉 Todas as senhas foram corrigidas!");
    console.log("📝 Credenciais para teste:");
    console.log("👨‍💼 Admin: admin@siqueiracampos.com / 123456");
    console.log("🏢 Corretor: corretor@siqueiracampos.com / 123456");
    console.log("👤 Usuário: usuario@teste.com / 123456");

    // Teste final
    console.log("\n🧪 Teste final de autenticação...");
    const testUser = await prisma.user.findUnique({
      where: { email: "admin@siqueiracampos.com" },
    });

    if (testUser && testUser.password) {
      const isValid = await bcrypt.compare("123456", testUser.password);
      console.log("✅ Teste de senha:", isValid ? "SUCESSO" : "FALHA");
    }
  } catch (error) {
    console.error("❌ Erro ao corrigir senhas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords();
