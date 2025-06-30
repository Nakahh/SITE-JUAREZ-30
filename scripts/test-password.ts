import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db",
    },
  },
});

async function testPassword() {
  try {
    const testEmail = "admin@siqueiracampos.com";
    const testPassword = "123456";

    console.log("🔐 Testando autenticação para:", testEmail);
    console.log("🔑 Senha de teste:", testPassword);
    console.log("");

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      console.log("❌ Usuário não encontrado");
      return;
    }

    console.log("✅ Usuário encontrado:", user.name);
    console.log("📧 Email:", user.email);
    console.log("👤 Role:", user.role);
    console.log("🔒 Hash da senha:", user.password ? "Presente" : "Ausente");
    console.log("");

    if (!user.password) {
      console.log("❌ Usuário não tem senha configurada");
      return;
    }

    // Testar a comparação de senha
    console.log("🧪 Testando comparação de senha...");
    const isValid = await bcrypt.compare(testPassword, user.password);

    if (isValid) {
      console.log("✅ Senha está correta!");
      console.log("🎉 Autenticação funcionando corretamente");
    } else {
      console.log("❌ Senha incorreta");
      console.log("🔍 Vamos testar gerar um novo hash...");

      // Gerar novo hash para comparação
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log("🆕 Novo hash gerado:", newHash);

      const newComparison = await bcrypt.compare(testPassword, newHash);
      console.log(
        "🧪 Teste com novo hash:",
        newComparison ? "Sucesso" : "Falha",
      );
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();
