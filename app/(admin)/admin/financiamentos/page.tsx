
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, TrendingUp, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function FinanciamentosPage() {
  // Buscar estatísticas
  const stats = {
    totalFinancings: await prisma.financing.count(),
    totalValue: await prisma.financing.aggregate({
      _sum: { financedAmount: true }
    }),
    approvedValue: await prisma.financing.aggregate({
      where: { status: "APPROVED" },
      _sum: { financedAmount: true }
    }),
    pendingCount: await prisma.financing.count({
      where: { status: "PENDING" }
    })
  }

  // Buscar financiamentos recentes
  const recentFinancings = await prisma.financing.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        select: { title: true, address: true }
      },
      client: {
        select: { name: true, email: true }
      },
      user: {
        select: { name: true, email: true }
      }
    }
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      SIMULATING: "outline",
      PENDING: "secondary",
      APPROVED: "default",
      REJECTED: "destructive",
      CONTRACTED: "default"
    }
    
    const labels: { [key: string]: string } = {
      SIMULATING: "Simulando",
      PENDING: "Pendente",
      APPROVED: "Aprovado",
      REJECTED: "Rejeitado",
      CONTRACTED: "Contratado"
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Financiamentos</h1>
          <p className="text-muted-foreground">Controle e acompanhe os financiamentos imobiliários</p>
        </div>
        <Button asChild>
          <Link href="/admin/financiamentos/new">Novo Financiamento</Link>
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Financiamentos</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFinancings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Financiado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalValue._sum.financedAmount || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Aprovado</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.approvedValue._sum.financedAmount || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Financiamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Financiamentos Recentes</CardTitle>
          <CardDescription>
            Últimos financiamentos registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor Imóvel</TableHead>
                <TableHead>Valor Financiado</TableHead>
                <TableHead>Parcela</TableHead>
                <TableHead>Sistema</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentFinancings.map((financing) => (
                <TableRow key={financing.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{financing.property.title}</p>
                      <p className="text-sm text-muted-foreground">{financing.property.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {financing.client?.name || financing.user?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {financing.client?.email || financing.user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(financing.propertyValue)}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(financing.financedAmount)}
                  </TableCell>
                  <TableCell>{formatCurrency(financing.monthlyPayment)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{financing.type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(financing.status)}</TableCell>
                  <TableCell>
                    {new Date(financing.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
