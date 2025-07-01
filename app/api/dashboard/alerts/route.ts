import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Alert {
  id: string;
  type: "info" | "warning" | "error" | "critical";
  title: string;
  message: string;
  category: "system" | "security" | "performance" | "database" | "users";
  severity: number; // 1-10
  timestamp: Date;
  action?: string;
  resolved: boolean;
  autoFixAvailable: boolean;
}

// In-memory alert storage (in production, use Redis or database)
let alerts: Alert[] = [];
let alertIdCounter = 1;

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
    const severity = url.searchParams.get("severity");
    const unresolved = url.searchParams.get("unresolved") === "true";

    // Generate intelligent alerts based on current system state
    generateIntelligentAlerts();

    let filteredAlerts = alerts;

    if (category) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.category === category,
      );
    }

    if (severity) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.severity >= parseInt(severity),
      );
    }

    if (unresolved) {
      filteredAlerts = filteredAlerts.filter((alert) => !alert.resolved);
    }

    // Sort by severity and timestamp
    filteredAlerts.sort((a, b) => {
      if (b.severity !== a.severity) {
        return b.severity - a.severity;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    return NextResponse.json({
      alerts: filteredAlerts.slice(0, 50), // Limit to 50 alerts
      summary: {
        total: alerts.length,
        unresolved: alerts.filter((a) => !a.resolved).length,
        critical: alerts.filter((a) => a.type === "critical").length,
        warning: alerts.filter((a) => a.type === "warning").length,
        info: alerts.filter((a) => a.type === "info").length,
      },
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
    const { action, alertId } = body;

    if (action === "resolve" && alertId) {
      const alertIndex = alerts.findIndex((alert) => alert.id === alertId);
      if (alertIndex !== -1) {
        alerts[alertIndex].resolved = true;
        return NextResponse.json({ success: true, message: "Alert resolved" });
      }
    }

    if (action === "resolveAll") {
      alerts.forEach((alert) => {
        alert.resolved = true;
      });
      return NextResponse.json({
        success: true,
        message: "All alerts resolved",
      });
    }

    if (action === "create") {
      const { type, title, message, category, severity } = body;
      const newAlert: Alert = {
        id: `alert-${alertIdCounter++}`,
        type,
        title,
        message,
        category,
        severity,
        timestamp: new Date(),
        resolved: false,
        autoFixAvailable: false,
      };
      alerts.unshift(newAlert);
      return NextResponse.json({ success: true, alert: newAlert });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error handling alert action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function generateIntelligentAlerts() {
  const now = new Date();
  const recentAlerts = alerts.filter(
    (alert) =>
      now.getTime() - alert.timestamp.getTime() < 60000 && !alert.resolved,
  );

  // Avoid duplicate alerts in the last minute
  if (recentAlerts.length > 5) return;

  // Simulate intelligent alert generation
  const alertTypes = [
    {
      condition: Math.random() > 0.7,
      alert: {
        type: "warning" as const,
        title: "CPU Usage Alto",
        message: `CPU está em ${(Math.random() * 30 + 70).toFixed(1)}%. Considere otimização.`,
        category: "system" as const,
        severity: 6,
        action: "optimize-cpu",
        autoFixAvailable: true,
      },
    },
    {
      condition: Math.random() > 0.8,
      alert: {
        type: "error" as const,
        title: "Memória Crítica",
        message: `Uso de memória excedeu 90%. Ação imediata necessária.`,
        category: "system" as const,
        severity: 8,
        action: "clear-memory",
        autoFixAvailable: true,
      },
    },
    {
      condition: Math.random() > 0.85,
      alert: {
        type: "critical" as const,
        title: "Disco Quase Cheio",
        message: `Espaço em disco abaixo de 10%. Sistema pode falhar.`,
        category: "system" as const,
        severity: 9,
        action: "cleanup-disk",
        autoFixAvailable: true,
      },
    },
    {
      condition: Math.random() > 0.75,
      alert: {
        type: "warning" as const,
        title: "Resposta Lenta",
        message: `Tempo de resposta médio: ${(Math.random() * 500 + 200).toFixed(0)}ms`,
        category: "performance" as const,
        severity: 5,
        action: "optimize-performance",
        autoFixAvailable: true,
      },
    },
    {
      condition: Math.random() > 0.9,
      alert: {
        type: "error" as const,
        title: "Tentativas de Invasão",
        message: `${Math.floor(Math.random() * 20 + 5)} tentativas de login suspeitas detectadas.`,
        category: "security" as const,
        severity: 7,
        action: "block-suspicious-ips",
        autoFixAvailable: true,
      },
    },
    {
      condition: Math.random() > 0.8,
      alert: {
        type: "warning" as const,
        title: "Database Lento",
        message: `${Math.floor(Math.random() * 15 + 5)} queries lentas detectadas na última hora.`,
        category: "database" as const,
        severity: 6,
        action: "optimize-database",
        autoFixAvailable: true,
      },
    },
    {
      condition: Math.random() > 0.7,
      alert: {
        type: "info" as const,
        title: "Pico de Usuários",
        message: `${Math.floor(Math.random() * 100 + 200)} usuários online simultaneamente.`,
        category: "users" as const,
        severity: 3,
        autoFixAvailable: false,
      },
    },
    {
      condition: Math.random() > 0.85,
      alert: {
        type: "warning" as const,
        title: "SSL Expirando",
        message: `Certificado SSL expira em ${Math.floor(Math.random() * 30 + 5)} dias.`,
        category: "security" as const,
        severity: 5,
        action: "renew-ssl",
        autoFixAvailable: true,
      },
    },
    {
      condition: Math.random() > 0.9,
      alert: {
        type: "critical" as const,
        title: "Falha de Backup",
        message: "Último backup falhou. Dados podem estar em risco.",
        category: "database" as const,
        severity: 9,
        action: "force-backup",
        autoFixAvailable: true,
      },
    },
    {
      condition: Math.random() > 0.8,
      alert: {
        type: "warning" as const,
        title: "Dependências Desatualizadas",
        message: `${Math.floor(Math.random() * 10 + 3)} dependências com vulnerabilidades conhecidas.`,
        category: "security" as const,
        severity: 6,
        action: "update-dependencies",
        autoFixAvailable: true,
      },
    },
  ];

  alertTypes.forEach((alertType) => {
    if (alertType.condition) {
      const newAlert: Alert = {
        id: `alert-${alertIdCounter++}`,
        ...alertType.alert,
        timestamp: now,
        resolved: false,
      };

      // Check if similar alert exists
      const similarExists = alerts.some(
        (existing) =>
          existing.title === newAlert.title &&
          !existing.resolved &&
          now.getTime() - existing.timestamp.getTime() < 300000, // 5 minutes
      );

      if (!similarExists) {
        alerts.unshift(newAlert);
      }
    }
  });

  // Keep only last 100 alerts
  alerts = alerts.slice(0, 100);

  // Auto-resolve some alerts after time
  alerts.forEach((alert) => {
    const ageMinutes = (now.getTime() - alert.timestamp.getTime()) / 60000;
    if (ageMinutes > 30 && alert.type === "info") {
      alert.resolved = true;
    }
    if (ageMinutes > 60 && alert.type === "warning" && Math.random() > 0.7) {
      alert.resolved = true;
    }
  });
}

// Initialize with some sample alerts
function initializeSampleAlerts() {
  if (alerts.length === 0) {
    const sampleAlerts: Alert[] = [
      {
        id: "alert-0",
        type: "info",
        title: "Sistema Inicializado",
        message: "Dashboard estatístico foi inicializado com sucesso.",
        category: "system",
        severity: 2,
        timestamp: new Date(),
        resolved: false,
        autoFixAvailable: false,
      },
    ];
    alerts.push(...sampleAlerts);
  }
}

// Initialize sample alerts when module loads
initializeSampleAlerts();
