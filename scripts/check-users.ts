import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db",
    },
  },
});

async function checkUsers() {
  try {
    console.log("🔍 Verificando usuários no banco de dados...\n");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        createdAt: true,
      },
    });

    if (users.length === 0) {
      console.log("❌ Nenhum usuário encontrado no banco de dados.");
      return;
    }

    console.log(`✅ Encontrados ${users.length} usuários:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Tem senha: ${user.password ? "Sim" : "Não"}`);
      console.log(`   Criado: ${user.createdAt.toLocaleDateString("pt-BR")}`);
      console.log("");
    });

    // Teste específico para usuários de teste
    const testUsers = [
      "admin@siqueiracampos.com",
      "corretor@siqueiracampos.com",
      "usuario@teste.com",
    ];

    console.log("🧪 Verificando usuários de teste específicos:\n");

    for (const email of testUsers) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
        },
      });

      if (user) {
        console.log(`✅ ${email} - Encontrado`);
        console.log(`   Nome: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(
          `   Senha hash: ${user.password ? "Configurada" : "Não configurada"}`,
        );
      } else {
        console.log(`❌ ${email} - Não encontrado`);
      }
      console.log("");
    }
  } catch (error) {
    console.error("❌ Erro ao verificar usuários:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
