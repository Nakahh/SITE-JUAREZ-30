
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Download, TrendingUp, TrendingDown, DollarSign, Home, Users, 
  Calendar, FileText, Eye, Filter
} from "lucide-react";

interface FinancialData {
  totalSales: number;
  totalCommissions: number;
  totalProperties: number;
  totalClients: number;
  monthlyData: Array<{
    month: string;
    sales: number;
    commissions: number;
    properties: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export default function RelatoriosPage() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    fetchReportsData();
  }, [selectedPeriod, startDate, endDate]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      // Simulando dados - substituir por chamada real à API
      const mockData: FinancialData = {
        totalSales: 2450000,
        totalCommissions: 147000,
        totalProperties: 24,
        totalClients: 48,
        monthlyData: [
          { month: "Jan", sales: 350000, commissions: 21000, properties: 3 },
          { month: "Fev", sales: 420000, commissions: 25200, properties: 4 },
          { month: "Mar", sales: 380000, commissions: 22800, properties: 3 },
          { month: "Abr", sales: 450000, commissions: 27000, properties: 4 },
          { month: "Mai", sales: 520000, commissions: 31200, properties: 5 },
          { month: "Jun", sales: 330000, commissions: 19800, properties: 5 },
        ],
        categoryData: [
          { name: "Casas", value: 45, color: "#1a472a" },
          { name: "Apartamentos", value: 30, color: "#2d5d3d" },
          { name: "Terrenos", value: 15, color: "#4ade80" },
          { name: "Comerciais", value: 10, color: "#22c55e" },
        ]
      };
      
      setTimeout(() => {
        setData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const exportToPDF = () => {
    // Implementar exportação para PDF
    console.log("Exportando relatório para PDF...");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1a472a] dark:text-[#4ade80]">
            Relatórios Financeiros
          </h1>
          <p className="text-muted-foreground">
            Análise completa do desempenho financeiro
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportToPDF} className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#1a472a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-[#1a472a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1a472a]">
              {formatCurrency(data.totalSales)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2d5d3d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#2d5d3d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2d5d3d]">
              {formatCurrency(data.totalCommissions)}
            </div>
            <p className="text-xs text-muted-foreground">
              6% do total de vendas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#4ade80]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imóveis Vendidos</CardTitle>
            <Home className="h-4 w-4 text-[#4ade80]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#4ade80]">
              {data.totalProperties}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8 imóveis este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#22c55e]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-[#22c55e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22c55e]">
              {data.totalClients}
            </div>
            <p className="text-xs text-muted-foreground">
              +15 novos clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="vendas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="detalhado">Detalhado</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Vendas</CardTitle>
              <CardDescription>
                Acompanhe o desempenho mensal das vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), 'Vendas']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#1a472a" 
                    fill="#1a472a"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comissoes">
          <Card>
            <CardHeader>
              <CardTitle>Comissões por Mês</CardTitle>
              <CardDescription>
                Acompanhe as comissões mensais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), 'Comissões']}
                  />
                  <Bar dataKey="commissions" fill="#2d5d3d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Categoria</CardTitle>
              <CardDescription>
                Distribuição das vendas por tipo de imóvel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {data.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalhado">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Detalhado</CardTitle>
              <CardDescription>
                Todas as transações do período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>15/01/2024</TableCell>
                    <TableCell>Casa no Setor Bueno</TableCell>
                    <TableCell>João Silva</TableCell>
                    <TableCell>{formatCurrency(450000)}</TableCell>
                    <TableCell>{formatCurrency(27000)}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        Finalizada
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {/* Mais linhas de exemplo */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
