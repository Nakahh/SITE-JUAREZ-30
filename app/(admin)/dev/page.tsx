"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Terminal,
  Database,
  Server,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Clock,
  Eye,
  Play,
  Square,
  RotateCcw,
  Download,
  Upload,
  Code,
  Bug,
  Zap,
  Shield,
  Key,
  FileText,
  Activity,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Save,
  Copy,
  ExternalLink,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  component?: string;
  details?: any;
}

interface SystemStats {
  uptime: number;
  memory: { used: number; total: number };
  cpu: number;
  requests: number;
  errors: number;
  responseTime: number;
}

export default function DevPage() {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    uptime: 0,
    memory: { used: 0, total: 100 },
    cpu: 0,
    requests: 0,
    errors: 0,
    responseTime: 0,
  });
  const [isServerRunning, setIsServerRunning] = useState(true);
  const [commandOutput, setCommandOutput] = useState("");
  const [selectedCommand, setSelectedCommand] = useState("");
  const [customCommand, setCustomCommand] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterLevel, setFilterLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Authentication check
  useEffect(() => {
    if (session?.user?.email === "vitor.nakahh@gmail.com") {
      setIsAuthenticated(true);
    }
  }, [session]);

  // Auto-refresh logs and stats
  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return;

    const interval = setInterval(() => {
      fetchLogs();
      fetchSystemStats();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated]);

  // Scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handlePasswordSubmit = () => {
    if (password === "Vitor.1234") {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/dev/logs");
      if (response.ok) {
        const newLogs = await response.json();
        setLogs((prev) => [...prev, ...newLogs].slice(-1000)); // Keep last 1000 logs
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await fetch("/api/dev/stats");
      if (response.ok) {
        const stats = await response.json();
        setSystemStats(stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const executeCommand = async (command: string) => {
    try {
      const response = await fetch("/api/dev/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      if (response.ok) {
        const result = await response.json();
        setCommandOutput(result.output);
        addLog("info", `Command executed: ${command}`, "System");
      } else {
        const error = await response.text();
        setCommandOutput(`Error: ${error}`);
        addLog("error", `Command failed: ${command}`, "System");
      }
    } catch (error) {
      setCommandOutput(`Error: ${error}`);
      addLog("error", `Command error: ${error}`, "System");
    }
  };

  const addLog = (
    level: LogEntry["level"],
    message: string,
    component?: string,
  ) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      component,
    };
    setLogs((prev) => [...prev, newLog].slice(-1000));
  };

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    const matchesSearch =
      searchTerm === "" ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.component?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const predefinedCommands = [
    { label: "Restart Server", command: "npm run dev", icon: RotateCcw },
    { label: "Build Project", command: "npm run build", icon: Code },
    { label: "Run Tests", command: "npm test", icon: CheckCircle },
    { label: "Database Reset", command: "npm run db:reset", icon: Database },
    { label: "Database Seed", command: "npm run db:seed", icon: Upload },
    {
      label: "Generate Prisma",
      command: "npm run db:generate",
      icon: Settings,
    },
    { label: "Push Database", command: "npm run db:push", icon: Database },
    { label: "Clear Cache", command: "rm -rf .next", icon: Trash2 },
    { label: "Install Dependencies", command: "npm install", icon: Download },
    { label: "Check Disk Space", command: "df -h", icon: HardDrive },
    { label: "Memory Usage", command: "free -h", icon: MemoryStick },
    { label: "Process List", command: "ps aux", icon: Activity },
  ];

  const commonErrors = [
    {
      title: "Module Not Found",
      description: "Missing dependencies or incorrect imports",
      solution: "npm install or check import paths",
      command: "npm install",
    },
    {
      title: "Database Connection",
      description: "Unable to connect to database",
      solution: "Check DATABASE_URL and restart",
      command: "npm run db:push",
    },
    {
      title: "Authentication Error",
      description: "NEXTAUTH_SECRET missing or invalid",
      solution: "Check environment variables",
      command: "echo $NEXTAUTH_SECRET",
    },
    {
      title: "Build Failed",
      description: "TypeScript or build errors",
      solution: "Clear cache and rebuild",
      command: "rm -rf .next && npm run build",
    },
    {
      title: "Port Already in Use",
      description: "Port 3000 is occupied",
      solution: "Kill process or use different port",
      command: "lsof -ti:3000 | xargs kill -9",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-purple-500" />
              Acesso DEV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value="vitor.nakahh@gmail.com"
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Digite a senha..."
              />
            </div>
            <Button
              onClick={handlePasswordSubmit}
              className="w-full"
              disabled={!password}
            >
              <Key className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Terminal className="h-8 w-8 text-blue-400" />
              Dev Dashboard
            </h1>
            <p className="text-blue-200 mt-1">
              Sistema de Desenvolvimento e Monitoramento
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={isServerRunning ? "default" : "destructive"}
              className="px-3 py-1"
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${isServerRunning ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
              />
              {isServerRunning ? "Online" : "Offline"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-green-500/20 border-green-500" : ""}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
              />
              Auto Refresh
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">CPU Usage</p>
                  <p className="text-2xl font-bold text-white">
                    {systemStats.cpu}%
                  </p>
                </div>
                <Cpu className="h-8 w-8 text-blue-400" />
              </div>
              <Progress value={systemStats.cpu} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Memory</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(
                      (systemStats.memory.used / systemStats.memory.total) *
                        100,
                    )}
                    %
                  </p>
                </div>
                <MemoryStick className="h-8 w-8 text-green-400" />
              </div>
              <Progress
                value={
                  (systemStats.memory.used / systemStats.memory.total) * 100
                }
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Requests</p>
                  <p className="text-2xl font-bold text-white">
                    {systemStats.requests}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Response Time</p>
                  <p className="text-2xl font-bold text-white">
                    {systemStats.responseTime}ms
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-blue-600"
            >
              <FileText className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
            <TabsTrigger
              value="commands"
              className="data-[state=active]:bg-blue-600"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Comandos
            </TabsTrigger>
            <TabsTrigger
              value="errors"
              className="data-[state=active]:bg-blue-600"
            >
              <Bug className="h-4 w-4 mr-2" />
              Erros
            </TabsTrigger>
            <TabsTrigger
              value="monitor"
              className="data-[state=active]:bg-blue-600"
            >
              <Monitor className="h-4 w-4 mr-2" />
              Monitor
            </TabsTrigger>
          </TabsList>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    System Logs
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Buscar logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48 bg-slate-700 border-slate-600"
                      />
                    </div>
                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                      <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLogs([])}
                      className="border-slate-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full rounded border border-slate-600 bg-slate-900 p-4">
                  <div className="space-y-1 font-mono text-sm">
                    {filteredLogs.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">
                        Nenhum log encontrado
                      </p>
                    ) : (
                      filteredLogs.map((log) => (
                        <div
                          key={log.id}
                          className={`flex items-center gap-3 p-2 rounded ${
                            log.level === "error"
                              ? "bg-red-900/20 text-red-300"
                              : log.level === "warn"
                                ? "bg-yellow-900/20 text-yellow-300"
                                : log.level === "debug"
                                  ? "bg-purple-900/20 text-purple-300"
                                  : "bg-slate-800/20 text-slate-300"
                          }`}
                        >
                          <span className="text-xs text-slate-500 w-20">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <Badge
                            variant="outline"
                            className={`w-16 justify-center text-xs ${
                              log.level === "error"
                                ? "border-red-500 text-red-500"
                                : log.level === "warn"
                                  ? "border-yellow-500 text-yellow-500"
                                  : log.level === "debug"
                                    ? "border-purple-500 text-purple-500"
                                    : "border-blue-500 text-blue-500"
                            }`}
                          >
                            {log.level.toUpperCase()}
                          </Badge>
                          {log.component && (
                            <span className="text-xs text-slate-400 w-24 truncate">
                              [{log.component}]
                            </span>
                          )}
                          <span className="flex-1">{log.message}</span>
                        </div>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Comandos Rápidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedCommands.map((cmd, index) => {
                      const Icon = cmd.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-3 flex flex-col items-center gap-2 border-slate-600 hover:bg-slate-700"
                          onClick={() => executeCommand(cmd.command)}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs text-center">
                            {cmd.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-600">
                    <Label className="text-white">Comando Customizado</Label>
                    <div className="flex gap-2">
                      <Input
                        value={customCommand}
                        onChange={(e) => setCustomCommand(e.target.value)}
                        placeholder="Digite um comando..."
                        className="bg-slate-700 border-slate-600"
                        onKeyPress={(e) =>
                          e.key === "Enter" && executeCommand(customCommand)
                        }
                      />
                      <Button
                        onClick={() => executeCommand(customCommand)}
                        disabled={!customCommand}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80 w-full rounded border border-slate-600 bg-slate-900 p-4">
                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                      {commandOutput || "Nenhum comando executado ainda..."}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" className="space-y-4">
            <div className="grid gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Erros Comuns e Soluções
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonErrors.map((error, index) => (
                    <Alert
                      key={index}
                      className="bg-slate-700/50 border-slate-600"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            {error.title}
                          </h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => executeCommand(error.command)}
                            className="border-slate-600"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Corrigir
                          </Button>
                        </div>
                        <p className="text-slate-300 text-sm">
                          {error.description}
                        </p>
                        <p className="text-blue-300 text-sm font-mono">
                          {error.solution}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitor Tab */}
          <TabsContent value="monitor" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Server Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Status do Servidor</span>
                    <Badge
                      variant={isServerRunning ? "default" : "destructive"}
                    >
                      {isServerRunning ? "Running" : "Stopped"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Uptime</span>
                    <span className="text-white">
                      {Math.floor(systemStats.uptime / 60)}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Port</span>
                    <span className="text-white">3000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Environment</span>
                    <span className="text-white">Development</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Connection</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Type</span>
                    <span className="text-white">SQLite</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Tables</span>
                    <span className="text-white">12</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600"
                    onClick={() => executeCommand("npm run db:studio")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Prisma Studio
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
