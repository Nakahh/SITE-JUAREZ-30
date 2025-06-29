
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function ComissoesPage() {
  // Buscar estatísticas
  const stats = {
    totalCommissions: await prisma.commission.count(),
    totalValue: await prisma.commission.aggregate({
      _sum: { commissionValue: true }
    }),
    paidValue: await prisma.commission.aggregate({
      where: { status: "PAID" },
      _sum: { commissionValue: true }
    }),
    pendingValue: await prisma.commission.aggregate({
      where: { status: "PENDING" },
      _sum: { commissionValue: true }
    })
  }

  // Buscar comissões recentes
  const recentCommissions = await prisma.commission.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        select: { title: true, address: true }
      },
      agent: {
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
      PENDING: "outline",
      PAID: "default",
      CANCELLED: "destructive"
    }
    
    const labels: { [key: string]: string } = {
      PENDING: "Pendente",
      PAID: "Pago",
      CANCELLED: "Cancelado"
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Comissões</h1>
          <p className="text-muted-foreground">Controle e acompanhe as comissões dos corretores</p>
        </div>
        <Button asChild>
          <Link href="/admin/comissoes/new">Nova Comissão</Link>
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Comissões</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCommissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalValue._sum.commissionValue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pago</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.paidValue._sum.commissionValue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.pendingValue._sum.commissionValue || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Comissões */}
      <Card>
        <CardHeader>
          <CardTitle>Comissões Recentes</CardTitle>
          <CardDescription>
            Últimas comissões registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Corretor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor Venda</TableHead>
                <TableHead>Comissão (%)</TableHead>
                <TableHead>Valor Comissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{commission.property.title}</p>
                      <p className="text-sm text-muted-foreground">{commission.property.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{commission.agent.name}</p>
                      <p className="text-sm text-muted-foreground">{commission.agent.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {commission.type === "SALE" ? "Venda" : "Locação"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(commission.saleValue)}</TableCell>
                  <TableCell>{commission.commissionPercentage}%</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(commission.commissionValue)}
                  </TableCell>
                  <TableCell>{getStatusBadge(commission.status)}</TableCell>
                  <TableCell>
                    {new Date(commission.createdAt).toLocaleDateString("pt-BR")}
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
