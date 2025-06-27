import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runHealthCheck() {
  console.log("🏥 Executando verificação de saúde da aplicação...\n");

  const results = {
    database: false,
    auth: false,
    properties: false,
    users: false,
    admin: false,
  };

  try {
    // 1. Teste de Conexão com Banco
    console.log("1️⃣ Testando conexão com banco de dados...");
    await prisma.$connect();
    console.log("   ✅ Conexão estabelecida com sucesso");
    results.database = true;

    // 2. Verificar estrutura de tabelas
    console.log("2️⃣ Verificando estrutura das tabelas...");
    const userCount = await prisma.user.count();
    const propertyCount = await prisma.property.count();
    const clientCount = await prisma.client.count();
    console.log(`   ✅ Usuários: ${userCount}`);
    console.log(`   ✅ Propriedades: ${propertyCount}`);
    console.log(`   ✅ Clientes: ${clientCount}`);

    // 3. Verificar usuários admin
    console.log("3️⃣ Verificando usuários administradores...");
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, name: true, email: true },
    });

    if (adminUsers.length > 0) {
      console.log(`   ✅ ${adminUsers.length} admin(s) encontrado(s):`);
      adminUsers.forEach((admin) => {
        console.log(`      - ${admin.name} (${admin.email})`);
      });
      results.admin = true;
    } else {
      console.log("   ⚠️  Nenhum usuário ADMIN encontrado");
    }

    // 4. Verificar propriedades recentes
    console.log("4️⃣ Verificando propriedades recentes...");
    const recentProperties = await prisma.property.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, price: true, type: true },
    });

    if (recentProperties.length > 0) {
      console.log(`   ✅ ${recentProperties.length} propriedades encontradas:`);
      recentProperties.forEach((prop) => {
        console.log(
          `      - ${prop.title} (${prop.type}): R$ ${prop.price.toLocaleString()}`,
        );
      });
      results.properties = true;
    } else {
      console.log("   ⚠️  Nenhuma propriedade encontrada");
    }

    // 5. Verificar usuários por tipo
    console.log("5️⃣ Verificando distribuição de usuários...");
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    usersByRole.forEach((group) => {
      console.log(`   ✅ ${group.role}: ${group._count.role} usuário(s)`);
    });
    results.users = true;

    // 6. Verificar artigos do blog
    console.log("6️⃣ Verificando sistema de blog...");
    const articleCount = await prisma.article.count();
    console.log(`   ✅ Artigos: ${articleCount}`);

    // 7. Verificar newsletter
    console.log("7️⃣ Verificando newsletter...");
    const newsletterCount = await prisma.newsletterSubscription.count();
    console.log(`   ✅ Inscritos na newsletter: ${newsletterCount}`);

    // 8. Verificar depoimentos
    console.log("8️⃣ Verificando depoimentos...");
    const testimonialCount = await prisma.testimonial.count();
    console.log(`   ✅ Depoimentos: ${testimonialCount}`);

    // 9. Verificar visitas agendadas
    console.log("9️⃣ Verificando visitas agendadas...");
    const visitCount = await prisma.visit.count();
    console.log(`   ✅ Visitas: ${visitCount}`);

    console.log("\n📊 RESUMO DA VERIFICAÇÃO:");
    console.log("================================");
    console.log(`Banco de Dados: ${results.database ? "✅ OK" : "❌ ERRO"}`);
    console.log(`Usuários: ${results.users ? "✅ OK" : "❌ ERRO"}`);
    console.log(`Administradores: ${results.admin ? "✅ OK" : "⚠️  ATENÇÃO"}`);
    console.log(
      `Propriedades: ${results.properties ? "✅ OK" : "⚠️  ATENÇÃO"}`,
    );

    const overallHealth = Object.values(results).filter(Boolean).length;
    const totalChecks = Object.keys(results).length;

    console.log(
      `\n🎯 SAÚDE GERAL: ${overallHealth}/${totalChecks} verificações OK`,
    );

    if (overallHealth === totalChecks) {
      console.log("🎉 SISTEMA TOTALMENTE FUNCIONAL!");
    } else if (overallHealth >= totalChecks * 0.8) {
      console.log("⚠️  SISTEMA FUNCIONANDO COM ALGUMAS ATENÇÕES");
    } else {
      console.log("❌ SISTEMA COM PROBLEMAS CRÍTICOS");
    }
  } catch (error) {
    console.error("❌ Erro durante verificação:", error);
    results.database = false;
  } finally {
    await prisma.$disconnect();
  }

  return results;
}

// Executar se chamado diretamente
if (require.main === module) {
  runHealthCheck()
    .then(() => {
      console.log("\n✅ Verificação de saúde concluída!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro fatal:", error);
      process.exit(1);
    });
}

export { runHealthCheck };
