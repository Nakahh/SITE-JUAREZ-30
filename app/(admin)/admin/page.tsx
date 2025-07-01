import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  MessageCircle,
  Calendar,
  Eye,
  Heart,
  Phone,
  Mail,
  Smartphone,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Dados mockados para demonstração
const dashboardStats = {
  properties: {
    total: 156,
    available: 89,
    sold: 34,
    rented: 33,
    growth: 12.5,
  },
  users: {
    total: 1247,
    active: 892,
    newThisMonth: 89,
    growth: 8.3,
  },
  financial: {
    totalSales: 12450000,
    commission: 623000,
    averagePrice: 485000,
    growth: 15.7,
  },
  visits: {
    scheduled: 45,
    completed: 123,
    pending: 12,
    conversionRate: 23.5,
  },
};

const systemStatus = {
  database: { status: "online", responseTime: "12ms" },
  api: { status: "online", responseTime: "45ms" },
  email: { status: "online", lastSent: "2 min ago" },
  whatsapp: { status: "online", messages: 156 },
  backup: { status: "completed", lastBackup: "2h ago" },
  ssl: { status: "valid", expiresIn: "89 days" },
};

const recentActivities = [
  {
    id: "1",
    type: "property_created",
    message: "Novo imóvel cadastrado: Casa 3 quartos Setor Oeste",
    timestamp: new Date(Date.now() - 300000),
    user: "João Silva",
  },
  {
    id: "2",
    type: "visit_scheduled",
    message: "Visita agendada para apartamento no Centro",
    timestamp: new Date(Date.now() - 600000),
    user: "Maria Santos",
  },
  {
    id: "3",
    type: "sale_completed",
    message: "Venda finalizada: R$ 450.000 - Apartamento Bueno",
    timestamp: new Date(Date.now() - 900000),
    user: "Carlos Oliveira",
  },
  {
    id: "4",
    type: "user_registered",
    message: "Novo usuário cadastrado",
    timestamp: new Date(Date.now() - 1200000),
    user: "Ana Costa",
  },
];

const topPerformers = [
  {
    name: "Carlos Silva",
    role: "Corretor Senior",
    sales: 12,
    commission: 89000,
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Maria Santos",
    role: "Corretora",
    sales: 8,
    commission: 67000,
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "João Oliveira",
    role: "Corretor",
    sales: 6,
    commission: 45000,
    avatar: "/placeholder-user.jpg",
  },
];

function SystemStatusCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Status do Sistema</span>
        </CardTitle>
        <CardDescription>
          Monitoramento em tempo real dos serviços
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(systemStatus).map(([service, data]) => (
          <div key={service} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {data.status === "online" ||
              data.status === "valid" ||
              data.status === "completed" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="capitalize font-medium">
                {service.replace("_", " ")}
              </span>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  data.status === "online" ||
                  data.status === "valid" ||
                  data.status === "completed"
                    ? "default"
                    : "destructive"
                }
              >
                {data.status}
              </Badge>
              {"responseTime" in data && data.responseTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  {data.responseTime}
                </p>
              )}
              {"lastSent" in data && data.lastSent && (
                <p className="text-xs text-muted-foreground mt-1">
                  {data.lastSent}
                </p>
              )}
              {"messages" in data && data.messages && (
                <p className="text-xs text-muted-foreground mt-1">
                  {data.messages} msg
                </p>
              )}
              {"lastBackup" in data && data.lastBackup && (
                <p className="text-xs text-muted-foreground mt-1">
                  {data.lastBackup}
                </p>
              )}
              {"expiresIn" in data && data.expiresIn && (
                <p className="text-xs text-muted-foreground mt-1">
                  {data.expiresIn}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentActivitiesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas ações realizadas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {activity.user}
                  </p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopPerformersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>Melhores corretores do mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((performer, index) => (
            <div key={performer.name} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium">{performer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {performer.role}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{performer.sales} vendas</p>
                <p className="text-sm text-green-600">
                  R$ {performer.commission.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral completa do sistema e negócios
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Imóveis Total
                </p>
                <p className="text-2xl font-bold">
                  {dashboardStats.properties.total}
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />+
                  {dashboardStats.properties.growth}% este mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Usuários
                </p>
                <p className="text-2xl font-bold">
                  {dashboardStats.users.total}
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />+
                  {dashboardStats.users.growth}% este mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Vendas Total
                </p>
                <p className="text-2xl font-bold">
                  R${" "}
                  {(dashboardStats.financial.totalSales / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />+
                  {dashboardStats.financial.growth}% este mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Visitas
                </p>
                <p className="text-2xl font-bold">
                  {dashboardStats.visits.scheduled}
                </p>
                <p className="text-xs text-blue-600">
                  {dashboardStats.visits.conversionRate}% conversão
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribuição de Imóveis</CardTitle>
            <CardDescription>
              Status atual do portfólio de imóveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Disponíveis</span>
                <span className="text-sm font-medium">
                  {dashboardStats.properties.available}
                </span>
              </div>
              <Progress
                value={
                  (dashboardStats.properties.available /
                    dashboardStats.properties.total) *
                  100
                }
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm">Vendidos</span>
                <span className="text-sm font-medium">
                  {dashboardStats.properties.sold}
                </span>
              </div>
              <Progress
                value={
                  (dashboardStats.properties.sold /
                    dashboardStats.properties.total) *
                  100
                }
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm">Alugados</span>
                <span className="text-sm font-medium">
                  {dashboardStats.properties.rented}
                </span>
              </div>
              <Progress
                value={
                  (dashboardStats.properties.rented /
                    dashboardStats.properties.total) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {dashboardStats.properties.available}
                </p>
                <p className="text-xs text-muted-foreground">Disponíveis</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardStats.properties.sold}
                </p>
                <p className="text-xs text-muted-foreground">Vendidos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardStats.properties.rented}
                </p>
                <p className="text-xs text-muted-foreground">Alugados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Financeiras</CardTitle>
            <CardDescription>Resumo financeiro do mês</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total em Vendas
                </span>
                <span className="font-medium">
                  R${" "}
                  {(dashboardStats.financial.totalSales / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Comissões</span>
                <span className="font-medium text-green-600">
                  R$ {(dashboardStats.financial.commission / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Preço Médio
                </span>
                <span className="font-medium">
                  R$ {(dashboardStats.financial.averagePrice / 1000).toFixed(0)}
                  K
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Crescimento</p>
                <p className="text-2xl font-bold text-green-600">
                  +{dashboardStats.financial.growth}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SystemStatusCard />
        <RecentActivitiesCard />
        <TopPerformersCard />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às funcionalidades principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild className="h-20 flex-col space-y-2">
              <Link href="/admin/imoveis/new">
                <Building2 className="h-6 w-6" />
                <span>Novo Imóvel</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-20 flex-col space-y-2"
            >
              <Link href="/admin/usuarios/new">
                <Users className="h-6 w-6" />
                <span>Novo Usuário</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-20 flex-col space-y-2"
            >
              <Link href="/admin/visitas">
                <Calendar className="h-6 w-6" />
                <span>Agendar Visita</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-20 flex-col space-y-2"
            >
              <Link href="/admin/evolution-api">
                <Smartphone className="h-6 w-6" />
                <span>WhatsApp API</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Evolution API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Status WhatsApp Business</span>
          </CardTitle>
          <CardDescription>Status da integração Evolution API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-green-500" />
                <span className="font-medium">Online</span>
              </div>
              <Badge variant="default">Conectado</Badge>
              <span className="text-sm text-muted-foreground">
                Instância: siqueira-campos-main
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-lg font-bold">156</p>
                <p className="text-xs text-muted-foreground">Mensagens</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">2.3min</p>
                <p className="text-xs text-muted-foreground">Tempo Resposta</p>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/evolution-api">Configurar</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
