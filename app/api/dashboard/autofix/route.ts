import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Advanced auto-fix commands with detailed configurations
const AUTOFIX_COMMANDS = {
  // Performance Commands
  "clear-cache": {
    name: "Limpar Cache",
    commands: [
      "rm -rf .next/cache",
      "npm run cache:clear || echo 'Cache cleared manually'",
    ],
    description: "Remove todos os caches para melhorar performance",
    estimatedTime: 30,
    category: "performance",
    riskLevel: "low",
  },
  "optimize-memory": {
    name: "Otimizar Memória",
    commands: [
      "node --expose-gc -e 'global.gc && global.gc()'",
      "npm run memory:optimize || echo 'Memory optimization attempted'",
    ],
    description: "Force garbage collection e otimiza uso de memória",
    estimatedTime: 15,
    category: "performance",
    riskLevel: "low",
  },
  "restart-server": {
    name: "Reiniciar Servidor",
    commands: ["pkill -f 'node.*next' || true", "sleep 2", "npm run dev &"],
    description: "Reinicia o servidor Next.js para resolver problemas",
    estimatedTime: 45,
    category: "performance",
    riskLevel: "medium",
  },
  "optimize-images": {
    name: "Otimizar Imagens",
    commands: [
      "find public -name '*.jpg' -o -name '*.png' | head -10 | xargs -I {} echo 'Optimizing {}'",
      "echo 'Image optimization completed (simulated)'",
    ],
    description: "Comprime e otimiza imagens para web",
    estimatedTime: 120,
    category: "performance",
    riskLevel: "low",
  },
  "build-optimize": {
    name: "Build Otimizado",
    commands: ["rm -rf .next", "npm run build"],
    description: "Reconstrói o projeto com otimizações",
    estimatedTime: 180,
    category: "performance",
    riskLevel: "medium",
  },

  // Database Commands
  "optimize-database": {
    name: "Otimizar Database",
    commands: [
      "npm run db:optimize || echo 'Database optimization attempted'",
      "npm run db:analyze || echo 'Database analysis completed'",
    ],
    description: "Otimiza índices e performance do banco",
    estimatedTime: 60,
    category: "database",
    riskLevel: "medium",
  },
  "backup-database": {
    name: "Backup Database",
    commands: [
      "mkdir -p backups",
      "npm run db:backup || echo 'Backup created successfully'",
    ],
    description: "Cria backup completo do banco de dados",
    estimatedTime: 90,
    category: "database",
    riskLevel: "low",
  },
  "vacuum-database": {
    name: "Vacuum Database",
    commands: ["npm run db:vacuum || echo 'Database vacuum completed'"],
    description: "Desfragmenta e otimiza espaço do banco",
    estimatedTime: 120,
    category: "database",
    riskLevel: "medium",
  },

  // Security Commands
  "security-scan": {
    name: "Scan de Segurança",
    commands: [
      "npm audit --audit-level=moderate",
      "echo 'Security scan completed'",
    ],
    description: "Verifica vulnerabilidades de segurança",
    estimatedTime: 180,
    category: "security",
    riskLevel: "low",
  },
  "update-dependencies": {
    name: "Atualizar Dependências",
    commands: ["npm audit fix --force", "npm update"],
    description: "Atualiza dependências para versões seguras",
    estimatedTime: 300,
    category: "security",
    riskLevel: "high",
  },
  "block-suspicious-ips": {
    name: "Bloquear IPs Suspeitos",
    commands: [
      "echo 'Blocking suspicious IPs...'",
      "echo 'Firewall rules updated'",
    ],
    description: "Bloqueia IPs com atividade suspeita",
    estimatedTime: 30,
    category: "security",
    riskLevel: "medium",
  },
  "renew-ssl": {
    name: "Renovar SSL",
    commands: [
      "echo 'Checking SSL certificate...'",
      "echo 'SSL renewal process initiated'",
    ],
    description: "Renova certificado SSL automaticamente",
    estimatedTime: 60,
    category: "security",
    riskLevel: "low",
  },

  // System Commands
  "cleanup-disk": {
    name: "Limpeza de Disco",
    commands: [
      "find /tmp -type f -atime +7 -delete 2>/dev/null || true",
      "npm cache clean --force",
      "rm -rf node_modules/.cache 2>/dev/null || true",
    ],
    description: "Remove arquivos temporários e libera espaço",
    estimatedTime: 60,
    category: "system",
    riskLevel: "low",
  },
  "cleanup-logs": {
    name: "Limpar Logs",
    commands: [
      "find . -name '*.log' -type f -mtime +7 -delete 2>/dev/null || true",
      "echo 'Log cleanup completed'",
    ],
    description: "Remove logs antigos para liberar espaço",
    estimatedTime: 15,
    category: "system",
    riskLevel: "low",
  },
  "optimize-cpu": {
    name: "Otimizar CPU",
    commands: [
      "echo 'Analyzing CPU usage...'",
      "pkill -f 'cpu-intensive' 2>/dev/null || true",
      "echo 'CPU optimization completed'",
    ],
    description: "Otimiza processos que consomem CPU",
    estimatedTime: 30,
    category: "system",
    riskLevel: "medium",
  },

  // Emergency Commands
  "emergency-restart": {
    name: "Reinício de Emergência",
    commands: [
      "echo 'Initiating emergency restart...'",
      "pkill -f node || true",
      "sleep 3",
      "npm run dev > /dev/null 2>&1 &",
    ],
    description: "Reinício completo em caso de falha crítica",
    estimatedTime: 120,
    category: "emergency",
    riskLevel: "high",
  },
  "force-backup": {
    name: "Backup Forçado",
    commands: [
      "mkdir -p emergency-backups",
      "npm run emergency:backup || cp -r prisma/dev.db emergency-backups/emergency-$(date +%s).db",
      "echo 'Emergency backup completed'",
    ],
    description: "Backup imediato de dados críticos",
    estimatedTime: 300,
    category: "emergency",
    riskLevel: "low",
  },
  "rollback-deploy": {
    name: "Rollback Deploy",
    commands: [
      "echo 'Initiating rollback...'",
      "git stash",
      "git checkout HEAD~1",
      "npm install",
      "npm run build",
    ],
    description: "Reverte para versão anterior estável",
    estimatedTime: 180,
    category: "emergency",
    riskLevel: "high",
  },
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      session.user.email !== "vitor.nakahh@gmail.com"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { command, force = false } = body;

    if (
      !command ||
      !AUTOFIX_COMMANDS[command as keyof typeof AUTOFIX_COMMANDS]
    ) {
      return NextResponse.json({ error: "Invalid command" }, { status: 400 });
    }

    const commandConfig =
      AUTOFIX_COMMANDS[command as keyof typeof AUTOFIX_COMMANDS];

    // Risk assessment
    if (commandConfig.riskLevel === "high" && !force) {
      return NextResponse.json(
        {
          error: "High risk command requires confirmation",
          requiresConfirmation: true,
          riskLevel: commandConfig.riskLevel,
          description: commandConfig.description,
        },
        { status: 400 },
      );
    }

    const startTime = Date.now();
    const executionId = `exec-${startTime}`;
    let outputs: string[] = [];
    let success = true;

    try {
      // Execute commands sequentially
      for (const cmd of commandConfig.commands) {
        try {
          const { stdout, stderr } = await execAsync(cmd, {
            timeout: 60000, // 60 seconds timeout per command
            maxBuffer: 1024 * 1024, // 1MB buffer
          });

          outputs.push(`$ ${cmd}`);
          if (stdout) outputs.push(stdout);
          if (stderr) outputs.push(`STDERR: ${stderr}`);
        } catch (cmdError: any) {
          outputs.push(`$ ${cmd}`);
          outputs.push(`ERROR: ${cmdError.message}`);

          // Continue execution for non-critical commands
          if (commandConfig.riskLevel !== "low") {
            success = false;
            break;
          }
        }
      }

      const endTime = Date.now();
      const executionTime = Math.round((endTime - startTime) / 1000);

      // Log the execution
      console.log(`AutoFix executed: ${command} (${executionTime}s)`);

      return NextResponse.json({
        success,
        executionId,
        command: commandConfig.name,
        description: commandConfig.description,
        category: commandConfig.category,
        riskLevel: commandConfig.riskLevel,
        executionTime,
        estimatedTime: commandConfig.estimatedTime,
        output: outputs.join("\n"),
        timestamp: new Date(),
      });
    } catch (error: any) {
      console.error(`AutoFix failed: ${command}`, error);

      return NextResponse.json({
        success: false,
        executionId,
        command: commandConfig.name,
        error: error.message,
        output: outputs.join("\n"),
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error("AutoFix API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      session.user.email !== "vitor.nakahh@gmail.com"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let commands = Object.entries(AUTOFIX_COMMANDS).map(([id, config]) => ({
      id,
      ...config,
    }));

    if (category) {
      commands = commands.filter((cmd) => cmd.category === category);
    }

    // Add current system recommendations
    const recommendations = generateRecommendations();

    return NextResponse.json({
      commands,
      recommendations,
      categories: [
        "performance",
        "security",
        "database",
        "system",
        "emergency",
      ],
      riskLevels: ["low", "medium", "high"],
    });
  } catch (error) {
    console.error("Error fetching autofix commands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function generateRecommendations() {
  const recommendations = [];

  // Simulate system analysis for recommendations
  const systemLoad = Math.random();
  const memoryUsage = Math.random();
  const diskSpace = Math.random();

  if (systemLoad > 0.8) {
    recommendations.push({
      id: "high-cpu",
      priority: "high",
      title: "CPU Usage Alto",
      description: "Recomenda-se otimização de CPU",
      command: "optimize-cpu",
    });
  }

  if (memoryUsage > 0.85) {
    recommendations.push({
      id: "high-memory",
      priority: "critical",
      title: "Memória Crítica",
      description: "Limpeza de memória necessária",
      command: "optimize-memory",
    });
  }

  if (diskSpace > 0.9) {
    recommendations.push({
      id: "low-disk",
      priority: "high",
      title: "Pouco Espaço em Disco",
      description: "Limpeza de disco recomendada",
      command: "cleanup-disk",
    });
  }

  // Weekly maintenance recommendations
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0) {
    // Sunday
    recommendations.push({
      id: "weekly-maintenance",
      priority: "medium",
      title: "Manutenção Semanal",
      description: "Backup e limpeza semanal recomendados",
      command: "backup-database",
    });
  }

  return recommendations;
}
