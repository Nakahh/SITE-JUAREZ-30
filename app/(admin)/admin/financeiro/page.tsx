
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  FileText,
  Plus,
  Download,
  Calendar,
  PieChart
} from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: Date;
  propertyId?: string;
  status: "pending" | "completed" | "cancelled";
}

interface Commission {
  id: string;
  agentId: string;
  agentName: string;
  propertyId: string;
  propertyAddress: string;
  saleValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: "pending" | "paid" | "cancelled";
  dueDate: Date;
}

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data
  useEffect(() => {
    setTransactions([
      {
        id: "1",
        type: "income",
        category: "Vendas",
        amount: 450000,
        description: "Venda Casa Setor Bueno",
        date: new Date("2024-01-15"),
        propertyId: "prop-1",
        status: "completed"
      },
      {
        id: "2",
        type: "income",
        category: "Aluguéis",
        amount: 2800,
        description: "Aluguel Apt. 101 - Janeiro",
        date: new Date("2024-01-01"),
        status: "completed"
      },
      {
        id: "3",
        type: "expense",
        category: "Marketing",
        amount: 3500,
        description: "Publicidade Digital",
        date: new Date("2024-01-10"),
        status: "completed"
      }
    ]);

    setCommissions([
      {
        id: "1",
        agentId: "agent-1",
        agentName: "João Silva",
        propertyId: "prop-1",
        propertyAddress: "Rua das Flores, 123",
        saleValue: 450000,
        commissionRate: 6,
        commissionAmount: 27000,
        status: "pending",
        dueDate: new Date("2024-02-15")
      }
    ]);
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const pendingCommissions = commissions
    .filter(c => c.status === "pending")
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">
            Gestão completa das finanças da imobiliária
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                +12.5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                -5.2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(netProfit)}
              </div>
              <p className="text-xs text-muted-foreground">
                +18.7% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comissões Pendentes</CardTitle>
              <Calculator className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(pendingCommissions)}
              </div>
              <p className="text-xs text-muted-foreground">
                {commissions.filter(c => c.status === "pending").length} pendentes
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="budget">Orçamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transações</CardTitle>
                <CardDescription>
                  Histórico de todas as receitas e despesas
                </CardDescription>
              </div>
              <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Transação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nova Transação</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova receita ou despesa
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Receita</SelectItem>
                            <SelectItem value="expense">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vendas">Vendas</SelectItem>
                            <SelectItem value="alugueis">Aluguéis</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="operacional">Operacional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Valor</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        placeholder="Descrição da transação"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddTransactionOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button className="flex-1">
                        Salvar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.date.toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                          {transaction.type === "income" ? "Receita" : "Despesa"}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.status === "completed" ? "default" :
                            transaction.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {transaction.status === "completed" ? "Concluído" :
                           transaction.status === "pending" ? "Pendente" : "Cancelado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comissões</CardTitle>
              <CardDescription>
                Gestão de comissões dos corretores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Corretor</TableHead>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Valor da Venda</TableHead>
                    <TableHead>Taxa (%)</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>{commission.agentName}</TableCell>
                      <TableCell>{commission.propertyAddress}</TableCell>
                      <TableCell>{formatCurrency(commission.saleValue)}</TableCell>
                      <TableCell>{commission.commissionRate}%</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(commission.commissionAmount)}
                      </TableCell>
                      <TableCell>
                        {commission.dueDate.toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            commission.status === "paid" ? "default" :
                            commission.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {commission.status === "paid" ? "Pago" :
                           commission.status === "pending" ? "Pendente" : "Cancelado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {commission.status === "pending" && (
                          <Button size="sm" variant="outline">
                            Marcar como Pago
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Relatório de Receitas por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Gráfico de receitas será implementado aqui
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Fluxo de Caixa Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Gráfico de fluxo de caixa será implementado aqui
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orçamentos e Metas</CardTitle>
              <CardDescription>
                Defina metas financeiras e acompanhe o progresso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Sistema de orçamentos será implementado aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
