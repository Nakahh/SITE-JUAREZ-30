import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixCommonIssues() {
  console.log("🔧 Verificando e corrigindo problemas comuns...");

  try {
    // Testar conexão com banco
    console.log("📊 Testando conexão com banco de dados...");
    await prisma.$connect();
    console.log("✅ Conexão com banco estabelecida");

    // Verificar se tabelas existem
    console.log("🔍 Verificando estrutura do banco...");
    const tables = (await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `) as any[];

    const requiredTables = [
      "User",
      "Property",
      "Client",
      "Article",
      "Visit",
      "FinancialRecord",
    ];
    const missingTables = requiredTables.filter(
      (table) => !tables.some((t) => t.table_name === table),
    );

    if (missingTables.length > 0) {
      console.log("❌ Tabelas faltando:", missingTables);
      console.log("Execute: npx prisma db push");
    } else {
      console.log("✅ Todas as tabelas necessárias existem");
    }

    // Verificar se há usuários admin
    console.log("👤 Verificando usuários admin...");
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminCount === 0) {
      console.log("❌ Nenhum usuário ADMIN encontrado");
      console.log("Execute: npx tsx scripts/seed.ts");
    } else {
      console.log(`✅ ${adminCount} usuário(s) ADMIN encontrado(s)`);
    }

    // Verificar propriedades órfãs (sem agente)
    console.log("🏠 Verificando propriedades...");
    const orphanProperties = await prisma.property.count({
      where: { agentId: null },
    });

    if (orphanProperties > 0) {
      console.log(`⚠️ ${orphanProperties} propriedade(s) sem agente atribuído`);

      // Buscar primeiro agente disponível
      const firstAgent = await prisma.user.findFirst({
        where: { role: "AGENT" },
      });

      if (firstAgent) {
        console.log("🔧 Atribuindo propriedades órfãs ao primeiro agente...");
        await prisma.property.updateMany({
          where: { agentId: null },
          data: { agentId: firstAgent.id },
        });
        console.log("✅ Propriedades órfãs corrigidas");
      }
    } else {
      console.log("✅ Todas as propriedades têm agente atribuído");
    }

    // Verificar integridade dos dados
    console.log("🔍 Verificando integridade dos dados...");

    // Buscar favoritos com referências inválidas
    const invalidFavorites = await prisma.favoriteProperty.findMany({
      where: {
        OR: [{ user: null }, { property: null }],
      },
      include: {
        user: true,
        property: true,
      },
    });

    if (invalidFavorites.length > 0) {
      console.log(
        `🧹 Removendo ${invalidFavorites.length} favorito(s) inválido(s)...`,
      );
      await prisma.favoriteProperty.deleteMany({
        where: {
          id: {
            in: invalidFavorites.map((f) => f.id),
          },
        },
      });
      console.log("✅ Favoritos inválidos removidos");
    }

    console.log("\n🎉 Verificação concluída!");
    console.log("\n📋 Próximos passos recomendados:");
    console.log("1. npm run build - Verificar se build funciona");
    console.log("2. npm run dev - Iniciar servidor de desenvolvimento");
    console.log("3. Acessar http://localhost:3000/admin para testar");
  } catch (error) {
    console.error("❌ Erro durante verificação:", error);

    if (error instanceof Error) {
      if (error.message.includes("connect")) {
        console.log("\n🔧 Problema de conexão com banco:");
        console.log("1. Verifique se PostgreSQL está rodando");
        console.log("2. Confirme a DATABASE_URL no arquivo .env");
        console.log("3. Execute: npx prisma db push");
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  fixCommonIssues()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default fixCommonIssues;
