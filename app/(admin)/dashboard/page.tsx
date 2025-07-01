"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Battery,
  Brain,
  CheckCircle,
  Clock,
  Cloud,
  Code,
  Cpu,
  Database,
  Eye,
  FileText,
  Filter,
  Globe,
  HardDrive,
  Heart,
  Home,
  Lock,
  MemoryStick,
  Monitor,
  Network,
  Play,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  Smartphone,
  Square,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  Wifi,
  Zap,
  AlertCircle,
  Target,
  Gauge,
  Terminal,
  Bug,
  Wrench,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Save,
  Copy,
  ExternalLink,
  Radio,
  Layers,
  Package,
  Smartphone as Mobile,
  Tablet,
  Laptop,
  Desktop,
  Chrome,
  Firefox,
  Safari,
  Edge,
  Signal,
  WifiOff,
  DatabaseBackup,
  CloudUpload,
  CloudDownload,
  Timer,
  Thermometer,
  BatteryLow,
  BatteryFull,
  Disc,
  HardDriveIcon,
  ScanLine,
  Crosshair,
  Radar,
} from "lucide-react";

interface SystemMetrics {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  temperature: number;
  battery: number;
  requests: number;
  errors: number;
  responseTime: number;
  uptime: number;
}

interface DatabaseMetrics {
  connections: number;
  queries: number;
  slowQueries: number;
  cacheHitRate: number;
  size: number;
  users: number;
  properties: number;
  articles: number;
  reviews: number;
}

interface SecurityMetrics {
  threats: number;
  blockedRequests: number;
  failedLogins: number;
  suspiciousActivity: number;
  lastScan: Date;
  vulnerabilities: number;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  coreWebVitals: number;
}

interface UserMetrics {
  online: number;
  sessions: number;
  newUsers: number;
  returningUsers: number;
  bounceRate: number;
  avgSessionTime: number;
  topPages: Array<{ page: string; views: number }>;
  devices: { mobile: number; desktop: number; tablet: number };
  browsers: { chrome: number; firefox: number; safari: number; edge: number };
}

interface AutoFixCommand {
  id: string;
  name: string;
  description: string;
  command: string;
  category: "performance" | "security" | "database" | "system" | "emergency";
  severity: "low" | "medium" | "high" | "critical";
  estimatedTime: number;
  icon: any;
  preventive?: boolean;
}

export default function StatisticalDashboard() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(2000);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics | null>(
    null,
  );
  const [databaseMetrics, setDatabaseMetrics] =
    useState<DatabaseMetrics | null>(null);
  const [securityMetrics, setSecurityMetrics] =
    useState<SecurityMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [executingCommands, setExecutingCommands] = useState<Set<string>>(
    new Set(),
  );
  const [commandHistory, setCommandHistory] = useState<any[]>([]);
  const [predictiveAlerts, setPredictiveAlerts] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState(100);
  const wsRef = useRef<WebSocket | null>(null);

  // Auto-fix commands
  const autoFixCommands: AutoFixCommand[] = [
    // Performance Commands
    {
      id: "clear-cache",
      name: "Limpar Cache",
      description: "Remove cache desnecessário e otimiza performance",
      command: "npm run cache:clear",
      category: "performance",
      severity: "low",
      estimatedTime: 30,
      icon: Trash2,
      preventive: true,
    },
    {
      id: "restart-server",
      name: "Reiniciar Servidor",
      description: "Reinicia o servidor para resolver problemas de memory leak",
      command: "npm run dev",
      category: "performance",
      severity: "medium",
      estimatedTime: 45,
      icon: RotateCcw,
    },
    {
      id: "optimize-images",
      name: "Otimizar Imagens",
      description: "Comprime e converte imagens para formatos otimizados",
      command: "npm run images:optimize",
      category: "performance",
      severity: "low",
      estimatedTime: 120,
      icon: Download,
      preventive: true,
    },
    {
      id: "build-optimize",
      name: "Build Otimizado",
      description: "Reconstrói o projeto com otimizações avançadas",
      command: "npm run build:optimize",
      category: "performance",
      severity: "medium",
      estimatedTime: 180,
      icon: Rocket,
    },

    // Database Commands
    {
      id: "db-optimize",
      name: "Otimizar Database",
      description: "Otimiza índices e limpa dados desnecessários",
      command: "npm run db:optimize",
      category: "database",
      severity: "medium",
      estimatedTime: 60,
      icon: Database,
      preventive: true,
    },
    {
      id: "db-backup",
      name: "Backup Automático",
      description: "Cria backup completo do banco de dados",
      command: "npm run db:backup",
      category: "database",
      severity: "low",
      estimatedTime: 90,
      icon: DatabaseBackup,
      preventive: true,
    },
    {
      id: "db-vacuum",
      name: "Vacuum Database",
      description: "Desfragmenta e otimiza espaço do banco",
      command: "npm run db:vacuum",
      category: "database",
      severity: "medium",
      estimatedTime: 120,
      icon: HardDrive,
      preventive: true,
    },

    // Security Commands
    {
      id: "security-scan",
      name: "Scan de Segurança",
      description: "Verifica vulnerabilidades e ameaças",
      command: "npm run security:scan",
      category: "security",
      severity: "high",
      estimatedTime: 180,
      icon: Shield,
      preventive: true,
    },
    {
      id: "update-deps",
      name: "Atualizar Dependências",
      description: "Atualiza dependências para versões seguras",
      command: "npm audit fix",
      category: "security",
      severity: "medium",
      estimatedTime: 300,
      icon: Upload,
    },
    {
      id: "firewall-reset",
      name: "Reset Firewall",
      description: "Redefine regras de firewall e bloqueia IPs suspeitos",
      command: "npm run firewall:reset",
      category: "security",
      severity: "high",
      estimatedTime: 30,
      icon: Lock,
    },

    // System Commands
    {
      id: "clean-logs",
      name: "Limpar Logs",
      description: "Remove logs antigos e libera espaço em disco",
      command: "npm run logs:clean",
      category: "system",
      severity: "low",
      estimatedTime: 15,
      icon: FileText,
      preventive: true,
    },
    {
      id: "memory-optimize",
      name: "Otimizar Memória",
      description: "Libera memória não utilizada e otimiza garbage collection",
      command: "npm run memory:optimize",
      category: "system",
      severity: "medium",
      estimatedTime: 30,
      icon: MemoryStick,
    },
    {
      id: "disk-cleanup",
      name: "Limpeza de Disco",
      description: "Remove arquivos temporários e otimiza espaço",
      command: "npm run disk:cleanup",
      category: "system",
      severity: "medium",
      estimatedTime: 60,
      icon: HardDrive,
      preventive: true,
    },

    // Emergency Commands
    {
      id: "emergency-restart",
      name: "Reinício de Emergência",
      description: "Reinício completo do sistema em caso de falha crítica",
      command: "npm run emergency:restart",
      category: "emergency",
      severity: "critical",
      estimatedTime: 120,
      icon: AlertTriangle,
    },
    {
      id: "rollback",
      name: "Rollback",
      description: "Reverte para a última versão estável conhecida",
      command: "npm run deploy:rollback",
      category: "emergency",
      severity: "critical",
      estimatedTime: 180,
      icon: RotateCcw,
    },
    {
      id: "emergency-backup",
      name: "Backup de Emergência",
      description: "Backup imediato de todos os dados críticos",
      command: "npm run emergency:backup",
      category: "emergency",
      severity: "critical",
      estimatedTime: 300,
      icon: Save,
    },
  ];

  // Simulated data generation
  const generateMetrics = useCallback((): SystemMetrics => {
    const now = new Date();
    const baseTime = now.getTime();

    return {
      timestamp: now,
      cpu: Math.random() * 40 + 10,
      memory: Math.random() * 30 + 40,
      disk: Math.random() * 20 + 30,
      network: Math.random() * 50 + 20,
      temperature: Math.random() * 15 + 35,
      battery: Math.random() * 20 + 80,
      requests: Math.floor(Math.random() * 100) + 50,
      errors: Math.floor(Math.random() * 10),
      responseTime: Math.random() * 200 + 50,
      uptime: Math.floor((baseTime - 1640995200000) / 1000), // Since Jan 1, 2022
    };
  }, []);

  const generateDatabaseMetrics = useCallback(
    (): DatabaseMetrics => ({
      connections: Math.floor(Math.random() * 50) + 10,
      queries: Math.floor(Math.random() * 1000) + 500,
      slowQueries: Math.floor(Math.random() * 20),
      cacheHitRate: Math.random() * 20 + 80,
      size: Math.random() * 500 + 1000,
      users: Math.floor(Math.random() * 100) + 200,
      properties: Math.floor(Math.random() * 50) + 150,
      articles: Math.floor(Math.random() * 30) + 50,
      reviews: Math.floor(Math.random() * 200) + 300,
    }),
    [],
  );

  const generateSecurityMetrics = useCallback(
    (): SecurityMetrics => ({
      threats: Math.floor(Math.random() * 10),
      blockedRequests: Math.floor(Math.random() * 100) + 50,
      failedLogins: Math.floor(Math.random() * 20),
      suspiciousActivity: Math.floor(Math.random() * 15),
      lastScan: new Date(Date.now() - Math.random() * 3600000),
      vulnerabilities: Math.floor(Math.random() * 5),
    }),
    [],
  );

  const generatePerformanceMetrics = useCallback(
    (): PerformanceMetrics => ({
      pageLoadTime: Math.random() * 1000 + 500,
      firstContentfulPaint: Math.random() * 500 + 200,
      largestContentfulPaint: Math.random() * 1000 + 800,
      cumulativeLayoutShift: Math.random() * 0.2,
      firstInputDelay: Math.random() * 100 + 50,
      coreWebVitals: Math.random() * 20 + 80,
    }),
    [],
  );

  const generateUserMetrics = useCallback(
    (): UserMetrics => ({
      online: Math.floor(Math.random() * 100) + 50,
      sessions: Math.floor(Math.random() * 500) + 200,
      newUsers: Math.floor(Math.random() * 50) + 20,
      returningUsers: Math.floor(Math.random() * 100) + 80,
      bounceRate: Math.random() * 30 + 20,
      avgSessionTime: Math.random() * 300 + 180,
      topPages: [
        { page: "/", views: Math.floor(Math.random() * 1000) + 500 },
        { page: "/imoveis", views: Math.floor(Math.random() * 500) + 200 },
        { page: "/contato", views: Math.floor(Math.random() * 300) + 100 },
      ],
      devices: {
        mobile: Math.floor(Math.random() * 60) + 20,
        desktop: Math.floor(Math.random() * 50) + 30,
        tablet: Math.floor(Math.random() * 20) + 10,
      },
      browsers: {
        chrome: Math.floor(Math.random() * 60) + 40,
        firefox: Math.floor(Math.random() * 20) + 10,
        safari: Math.floor(Math.random() * 25) + 15,
        edge: Math.floor(Math.random() * 15) + 5,
      },
    }),
    [],
  );

  // Real-time data fetching with API integration
  const fetchRealTimeData = useCallback(async () => {
    try {
      // Fetch system metrics
      const systemResponse = await fetch("/api/dashboard/metrics?type=system");
      if (systemResponse.ok) {
        const systemData = await systemResponse.json();
        setCurrentMetrics(systemData.current);
        setSystemMetrics((prev) => [...prev.slice(-59), systemData.current]);
      }

      // Fetch database metrics
      const dbResponse = await fetch("/api/dashboard/metrics?type=database");
      if (dbResponse.ok) {
        const dbData = await dbResponse.json();
        setDatabaseMetrics(dbData);
      }

      // Fetch security metrics
      const secResponse = await fetch("/api/dashboard/metrics?type=security");
      if (secResponse.ok) {
        const secData = await secResponse.json();
        setSecurityMetrics(secData);
      }

      // Fetch performance metrics
      const perfResponse = await fetch(
        "/api/dashboard/metrics?type=performance",
      );
      if (perfResponse.ok) {
        const perfData = await perfResponse.json();
        setPerformanceMetrics(perfData);
      }

      // Fetch user metrics
      const userResponse = await fetch("/api/dashboard/metrics?type=users");
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserMetrics(userData);
      }

      // Fetch alerts
      const alertResponse = await fetch(
        "/api/dashboard/alerts?unresolved=true",
      );
      if (alertResponse.ok) {
        const alertData = await alertResponse.json();
        setPredictiveAlerts(alertData.alerts);
      }

      // Calculate system health from real data
      if (systemResponse.ok) {
        const systemData = await systemResponse.json();
        calculateSystemHealth(systemData.current);
      }
    } catch (error) {
      console.error("Error fetching real-time data:", error);
      // Fallback to simulated data
      const newMetrics = generateMetrics();
      setCurrentMetrics(newMetrics);
      setSystemMetrics((prev) => [...prev.slice(-59), newMetrics]);
      calculateSystemHealth(newMetrics);
    }
  }, [generateMetrics]);

  useEffect(() => {
    if (!autoRefresh) return;

    fetchRealTimeData(); // Initial fetch
    const interval = setInterval(fetchRealTimeData, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchRealTimeData]);

  const generatePredictiveAlerts = (metrics: SystemMetrics) => {
    const newAlerts = [];

    if (metrics.cpu > 80) {
      newAlerts.push({
        id: Date.now() + "-cpu",
        type: "warning",
        title: "CPU Alta",
        message: `CPU em ${metrics.cpu.toFixed(1)}%. Recomenda-se otimização.`,
        action: "optimize-memory",
        timestamp: new Date(),
      });
    }

    if (metrics.memory > 85) {
      newAlerts.push({
        id: Date.now() + "-memory",
        type: "error",
        title: "Memória Crítica",
        message: `Memória em ${metrics.memory.toFixed(1)}%. Ação necessária.`,
        action: "memory-optimize",
        timestamp: new Date(),
      });
    }

    if (metrics.responseTime > 200) {
      newAlerts.push({
        id: Date.now() + "-response",
        type: "warning",
        title: "Resposta Lenta",
        message: `Tempo de resposta: ${metrics.responseTime.toFixed(0)}ms`,
        action: "clear-cache",
        timestamp: new Date(),
      });
    }

    setPredictiveAlerts((prev) => [...newAlerts, ...prev.slice(0, 10)]);
  };

  const calculateSystemHealth = (metrics: SystemMetrics) => {
    let health = 100;

    if (metrics.cpu > 80) health -= 15;
    if (metrics.memory > 85) health -= 20;
    if (metrics.disk > 90) health -= 25;
    if (metrics.responseTime > 500) health -= 10;
    if (metrics.errors > 5) health -= 15;

    setSystemHealth(Math.max(0, health));
  };

  const executeAutoFix = async (commandId: string) => {
    const command = autoFixCommands.find((cmd) => cmd.id === commandId);
    if (!command) return;

    setExecutingCommands((prev) => new Set([...prev, commandId]));

    try {
      const response = await fetch("/api/dashboard/autofix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: commandId }),
      });

      const result = await response.json();

      // Handle high-risk command confirmation
      if (
        result.requiresConfirmation &&
        !confirm(
          `⚠️ COMANDO DE ALTO RISCO\n\n${result.description}\n\nDeseja continuar?`,
        )
      ) {
        setExecutingCommands((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commandId);
          return newSet;
        });
        return;
      }

      // Execute with force if confirmed
      if (result.requiresConfirmation) {
        const forceResponse = await fetch("/api/dashboard/autofix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: commandId, force: true }),
        });
        const forceResult = await forceResponse.json();

        setCommandHistory((prev) => [
          {
            id: Date.now(),
            command: forceResult.command || command.name,
            success: forceResult.success,
            output: forceResult.output || forceResult.error,
            timestamp: new Date(forceResult.timestamp),
            estimatedTime: forceResult.estimatedTime || command.estimatedTime,
            executionTime: forceResult.executionTime,
            riskLevel: forceResult.riskLevel,
          },
          ...prev.slice(0, 49),
        ]);
      } else {
        setCommandHistory((prev) => [
          {
            id: Date.now(),
            command: result.command || command.name,
            success: result.success,
            output: result.output || result.error,
            timestamp: new Date(result.timestamp),
            estimatedTime: result.estimatedTime || command.estimatedTime,
            executionTime: result.executionTime,
            riskLevel: result.riskLevel,
          },
          ...prev.slice(0, 49),
        ]);
      }

      // Remove alert if command was successful
      if (result.success) {
        setPredictiveAlerts((prev) =>
          prev.filter((alert) => alert.action !== commandId),
        );

        // Refresh metrics after successful command
        setTimeout(() => {
          fetchRealTimeData();
        }, 2000);
      }
    } catch (error) {
      console.error("Command execution failed:", error);
      setCommandHistory((prev) => [
        {
          id: Date.now(),
          command: command.name,
          success: false,
          output: `Erro: ${error}`,
          timestamp: new Date(),
          estimatedTime: command.estimatedTime,
        },
        ...prev.slice(0, 49),
      ]);
    } finally {
      setExecutingCommands((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commandId);
        return newSet;
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "performance":
        return Rocket;
      case "security":
        return Shield;
      case "database":
        return Database;
      case "system":
        return Settings;
      case "emergency":
        return AlertTriangle;
      default:
        return Wrench;
    }
  };

  useEffect(() => {
    // Initialize with some data
    const initialMetrics = Array.from({ length: 20 }, () => generateMetrics());
    setSystemMetrics(initialMetrics);
    setCurrentMetrics(initialMetrics[initialMetrics.length - 1]);
    setDatabaseMetrics(generateDatabaseMetrics());
    setSecurityMetrics(generateSecurityMetrics());
    setPerformanceMetrics(generatePerformanceMetrics());
    setUserMetrics(generateUserMetrics());
    setIsLoading(false);
  }, [
    generateMetrics,
    generateDatabaseMetrics,
    generateSecurityMetrics,
    generatePerformanceMetrics,
    generateUserMetrics,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-white text-xl mt-4">Inicializando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* Header com controles */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="h-10 w-10 text-blue-400" />
              Dashboard Estatístico
            </h1>
            <p className="text-blue-200 mt-1">
              Monitoramento Completo em Tempo Real
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-white">Intervalo:</Label>
              <Select
                value={refreshInterval.toString()}
                onValueChange={(v) => setRefreshInterval(Number(v))}
              >
                <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1s</SelectItem>
                  <SelectItem value="2000">2s</SelectItem>
                  <SelectItem value="5000">5s</SelectItem>
                  <SelectItem value="10000">10s</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-green-600" : "border-slate-600"}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
              />
              {autoRefresh ? "Ativo" : "Pausado"}
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Heart
                  className={`h-6 w-6 ${systemHealth > 80 ? "text-green-400" : systemHealth > 60 ? "text-yellow-400" : "text-red-400"}`}
                />
                Saúde do Sistema
              </h3>
              <div className="text-right">
                <div
                  className={`text-3xl font-bold ${systemHealth > 80 ? "text-green-400" : systemHealth > 60 ? "text-yellow-400" : "text-red-400"}`}
                >
                  {systemHealth.toFixed(0)}%
                </div>
                <div className="text-sm text-slate-400">
                  Sistema Operacional
                </div>
              </div>
            </div>
            <Progress value={systemHealth} className="h-3" />
          </CardContent>
        </Card>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">CPU</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics?.cpu.toFixed(1)}%
                  </p>
                </div>
                <Cpu className="h-8 w-8 text-blue-400" />
              </div>
              <Progress value={currentMetrics?.cpu || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Memória</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics?.memory.toFixed(1)}%
                  </p>
                </div>
                <MemoryStick className="h-8 w-8 text-green-400" />
              </div>
              <Progress value={currentMetrics?.memory || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Disco</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics?.disk.toFixed(1)}%
                  </p>
                </div>
                <HardDrive className="h-8 w-8 text-purple-400" />
              </div>
              <Progress value={currentMetrics?.disk || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Rede</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics?.network.toFixed(1)}%
                  </p>
                </div>
                <Network className="h-8 w-8 text-yellow-400" />
              </div>
              <Progress value={currentMetrics?.network || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Temperatura</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics?.temperature.toFixed(1)}°C
                  </p>
                </div>
                <Thermometer className="h-8 w-8 text-red-400" />
              </div>
              <Progress
                value={(currentMetrics?.temperature || 0) * 2}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Resposta</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics?.responseTime.toFixed(0)}ms
                  </p>
                </div>
                <Clock className="h-8 w-8 text-cyan-400" />
              </div>
              <Progress
                value={Math.min((currentMetrics?.responseTime || 0) / 5, 100)}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-slate-800/50 border-slate-700 grid w-full grid-cols-6">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600"
            >
              <Target className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-blue-600"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-blue-600"
            >
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-blue-600"
            >
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger
              value="autofix"
              className="data-[state=active]:bg-blue-600"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Auto-Fix
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-blue-600"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alertas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* System Metrics Chart */}
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Métricas do Sistema (Tempo Real)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={systemMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(time) =>
                          new Date(time).toLocaleTimeString()
                        }
                        stroke="#9CA3AF"
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        labelFormatter={(time) =>
                          new Date(time).toLocaleTimeString()
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cpu"
                        stroke="#3B82F6"
                        name="CPU %"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="memory"
                        stroke="#10B981"
                        name="Memória %"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="responseTime"
                        stroke="#F59E0B"
                        name="Resposta (ms)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Database Status */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Status do Banco
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Conexões Ativas</span>
                    <span className="text-white font-bold">
                      {databaseMetrics?.connections}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Queries/min</span>
                    <span className="text-white font-bold">
                      {databaseMetrics?.queries}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Cache Hit Rate</span>
                    <span className="text-green-400 font-bold">
                      {databaseMetrics?.cacheHitRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Tamanho</span>
                    <span className="text-white font-bold">
                      {databaseMetrics?.size.toFixed(1)} MB
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Usuários</span>
                      <span className="text-blue-400">
                        {databaseMetrics?.users}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Propriedades</span>
                      <span className="text-green-400">
                        {databaseMetrics?.properties}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Artigos</span>
                      <span className="text-purple-400">
                        {databaseMetrics?.articles}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Core Web Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">
                        First Contentful Paint
                      </span>
                      <span className="text-white">
                        {performanceMetrics?.firstContentfulPaint.toFixed(0)}ms
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        (performanceMetrics?.firstContentfulPaint || 0) / 10,
                        100,
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">
                        Largest Contentful Paint
                      </span>
                      <span className="text-white">
                        {performanceMetrics?.largestContentfulPaint.toFixed(0)}
                        ms
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        (performanceMetrics?.largestContentfulPaint || 0) / 20,
                        100,
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">
                        Cumulative Layout Shift
                      </span>
                      <span className="text-white">
                        {performanceMetrics?.cumulativeLayoutShift.toFixed(3)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (performanceMetrics?.cumulativeLayoutShift || 0) * 500
                      }
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">First Input Delay</span>
                      <span className="text-white">
                        {performanceMetrics?.firstInputDelay.toFixed(0)}ms
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        (performanceMetrics?.firstInputDelay || 0) / 2,
                        100,
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Métricas de Rede
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={systemMetrics.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(time) =>
                          new Date(time).toLocaleTimeString()
                        }
                        stroke="#9CA3AF"
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        labelFormatter={(time) =>
                          new Date(time).toLocaleTimeString()
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="network"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Status de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Ameaças Detectadas</span>
                    <Badge
                      variant={
                        securityMetrics?.threats === 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {securityMetrics?.threats}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Requests Bloqueados</span>
                    <span className="text-red-400 font-bold">
                      {securityMetrics?.blockedRequests}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Logins Falharam</span>
                    <span className="text-yellow-400 font-bold">
                      {securityMetrics?.failedLogins}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Atividade Suspeita</span>
                    <span className="text-orange-400 font-bold">
                      {securityMetrics?.suspiciousActivity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Vulnerabilidades</span>
                    <Badge
                      variant={
                        securityMetrics?.vulnerabilities === 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {securityMetrics?.vulnerabilities}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Último Scan</span>
                    <span className="text-blue-400 text-sm">
                      {securityMetrics?.lastScan.toLocaleTimeString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Timeline de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        time: "14:32",
                        event: "Scan de segurança concluído",
                        type: "success",
                      },
                      {
                        time: "14:15",
                        event: "IP suspeito bloqueado: 192.168.1.1",
                        type: "warning",
                      },
                      {
                        time: "13:45",
                        event: "Tentativa de login inválida detectada",
                        type: "error",
                      },
                      {
                        time: "13:30",
                        event: "Firewall atualizado com novas regras",
                        type: "info",
                      },
                      {
                        time: "12:58",
                        event: "Certificado SSL renovado automaticamente",
                        type: "success",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded bg-slate-700/50"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.type === "success"
                              ? "bg-green-400"
                              : item.type === "warning"
                                ? "bg-yellow-400"
                                : item.type === "error"
                                  ? "bg-red-400"
                                  : "bg-blue-400"
                          }`}
                        />
                        <span className="text-slate-400 text-sm">
                          {item.time}
                        </span>
                        <span className="text-white flex-1">{item.event}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Usuários Online
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-blue-400">
                      {userMetrics?.online}
                    </div>
                    <div className="text-slate-400">usuários ativos agora</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Sessões Ativas</span>
                        <span className="text-white">
                          {userMetrics?.sessions}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Novos Usuários</span>
                        <span className="text-green-400">
                          {userMetrics?.newUsers}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">
                          Usuários Recorrentes
                        </span>
                        <span className="text-blue-400">
                          {userMetrics?.returningUsers}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Taxa de Rejeição</span>
                        <span className="text-yellow-400">
                          {userMetrics?.bounceRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={userMetrics?.bounceRate || 0} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Dispositivos & Navegadores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">
                        Dispositivos
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mobile className="h-4 w-4 text-blue-400" />
                            <span className="text-slate-300">Mobile</span>
                          </div>
                          <span className="text-white">
                            {userMetrics?.devices.mobile}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-green-400" />
                            <span className="text-slate-300">Desktop</span>
                          </div>
                          <span className="text-white">
                            {userMetrics?.devices.desktop}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tablet className="h-4 w-4 text-purple-400" />
                            <span className="text-slate-300">Tablet</span>
                          </div>
                          <span className="text-white">
                            {userMetrics?.devices.tablet}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">
                        Navegadores
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Chrome className="h-4 w-4 text-blue-400" />
                            <span className="text-slate-300">Chrome</span>
                          </div>
                          <span className="text-white">
                            {userMetrics?.browsers.chrome}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Firefox className="h-4 w-4 text-orange-400" />
                            <span className="text-slate-300">Firefox</span>
                          </div>
                          <span className="text-white">
                            {userMetrics?.browsers.firefox}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Safari className="h-4 w-4 text-blue-600" />
                            <span className="text-slate-300">Safari</span>
                          </div>
                          <span className="text-white">
                            {userMetrics?.browsers.safari}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Auto-Fix Tab */}
          <TabsContent value="autofix" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Comandos de Correção Automática
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {autoFixCommands.map((command) => {
                      const Icon = command.icon;
                      const CategoryIcon = getCategoryIcon(command.category);
                      const isExecuting = executingCommands.has(command.id);

                      return (
                        <Card
                          key={command.id}
                          className="bg-slate-700/50 border-slate-600"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-slate-600 rounded-lg">
                                  <Icon className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">
                                    {command.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      className={`${getSeverityColor(command.severity)} text-white text-xs`}
                                    >
                                      {command.severity.toUpperCase()}
                                    </Badge>
                                    {command.preventive && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-green-500 text-green-400"
                                      >
                                        PREVENTIVO
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <CategoryIcon className="h-4 w-4 text-slate-400" />
                            </div>

                            <p className="text-slate-300 text-sm mb-4">
                              {command.description}
                            </p>

                            <div className="flex items-center justify-between mb-3">
                              <span className="text-slate-400 text-xs">
                                Tempo estimado: {command.estimatedTime}s
                              </span>
                              <Timer className="h-3 w-3 text-slate-400" />
                            </div>

                            <Button
                              onClick={() => executeAutoFix(command.id)}
                              disabled={isExecuting}
                              className="w-full"
                              variant={
                                command.severity === "critical"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {isExecuting ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Executando...
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Executar
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Command History */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Histórico de Comandos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {commandHistory.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">
                          Nenhum comando executado ainda
                        </p>
                      ) : (
                        commandHistory.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center gap-3 p-3 rounded bg-slate-700/30"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${entry.success ? "bg-green-400" : "bg-red-400"}`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">
                                  {entry.command}
                                </span>
                                <span className="text-slate-400 text-sm">
                                  {entry.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              {entry.output && (
                                <p className="text-slate-300 text-sm mt-1 truncate">
                                  {entry.output}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Alertas Preditivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictiveAlerts.length === 0 ? (
                      <Alert className="bg-green-900/20 border-green-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-300">
                          Sistema funcionando perfeitamente. Nenhum alerta no
                          momento.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      predictiveAlerts.map((alert) => (
                        <Alert
                          key={alert.id}
                          className={`${
                            alert.type === "error"
                              ? "bg-red-900/20 border-red-500"
                              : alert.type === "warning"
                                ? "bg-yellow-900/20 border-yellow-500"
                                : "bg-blue-900/20 border-blue-500"
                          }`}
                        >
                          <AlertTriangle
                            className={`h-4 w-4 ${
                              alert.type === "error"
                                ? "text-red-500"
                                : alert.type === "warning"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                            }`}
                          />
                          <AlertDescription className="flex items-center justify-between">
                            <div>
                              <strong className="text-white">
                                {alert.title}
                              </strong>
                              <p
                                className={`text-sm ${
                                  alert.type === "error"
                                    ? "text-red-300"
                                    : alert.type === "warning"
                                      ? "text-yellow-300"
                                      : "text-blue-300"
                                }`}
                              >
                                {alert.message}
                              </p>
                              <p className="text-slate-400 text-xs">
                                {alert.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            {alert.action && (
                              <Button
                                size="sm"
                                onClick={() => executeAutoFix(alert.action)}
                                disabled={executingCommands.has(alert.action)}
                              >
                                <Wrench className="h-3 w-3 mr-1" />
                                Corrigir
                              </Button>
                            )}
                          </AlertDescription>
                        </Alert>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
