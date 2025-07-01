// Script para testar todas as rotas do sistema
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface RouteTest {
  path: string;
  description: string;
  expectedStatus?: number;
  requiresAuth?: boolean;
}

const routes: RouteTest[] = [
  // Páginas públicas
  { path: "/", description: "Homepage" },
  { path: "/login", description: "Página de Login" },
  { path: "/register", description: "Página de Registro" },
  { path: "/imoveis", description: "Listagem de Imóveis" },
  { path: "/blog", description: "Blog" },
  { path: "/sobre", description: "Sobre Nós" },
  { path: "/contato", description: "Contato" },
  { path: "/corretores", description: "Corretores" },
  { path: "/depoimentos", description: "Depoimentos" },
  { path: "/comparar", description: "Comparador de Imóveis" },
  {
    path: "/simulador-financiamento",
    description: "Simulador de Financiamento",
  },
  { path: "/desenvolvedor", description: "Página do Desenvolvedor" },
  { path: "/favoritos", description: "Favoritos" },

  // APIs públicas
  { path: "/api/auth/providers", description: "Auth Providers API" },
  {
    path: "/api/leads/webhook",
    description: "Webhook de Leads",
    expectedStatus: 405,
  }, // POST only

  // Páginas protegidas (devem redirecionar para login)
  {
    path: "/dashboard",
    description: "Dashboard do Cliente",
    requiresAuth: true,
  },
  { path: "/admin", description: "Dashboard Admin", requiresAuth: true },
];

async function testRoute(
  route: RouteTest,
): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const { stdout } = await execAsync(
      `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${route.path}`,
    );
    const status = parseInt(stdout.trim());

    if (route.requiresAuth) {
      // Páginas protegidas devem retornar 200 (se tiver middleware de redirect) ou 401/403
      const validStatuses = [200, 401, 403, 302]; // 302 para redirects
      return { success: validStatuses.includes(status), status };
    } else if (route.expectedStatus) {
      return { success: status === route.expectedStatus, status };
    } else {
      // Páginas públicas devem retornar 200
      return { success: status === 200, status };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function runTests() {
  console.log("🧪 Iniciando testes de rotas...\n");

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    process.stdout.write(
      `Testing ${route.path.padEnd(30)} - ${route.description.padEnd(30)} ... `,
    );

    const result = await testRoute(route);

    if (result.success) {
      console.log(`✅ PASS (${result.status})`);
      passed++;
    } else {
      console.log(
        `❌ FAIL (${result.status || "ERROR"})${result.error ? ` - ${result.error}` : ""}`,
      );
      failed++;
    }

    results.push({
      ...route,
      ...result,
    });
  }

  console.log("\n📊 Resultados dos Testes:");
  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${failed}`);
  console.log(
    `📈 Taxa de Sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`,
  );

  if (failed > 0) {
    console.log("\n❌ Rotas com problema:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(
          `   ${r.path} - ${r.description} (Status: ${r.status || "ERROR"})`,
        );
      });
  }

  console.log("\n🎉 Teste completo!");
  process.exit(failed > 0 ? 1 : 0);
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests, testRoute };
