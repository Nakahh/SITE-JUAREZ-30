import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  Home,
  Calendar,
  MessageCircle,
  Star,
  Mail,
  Newspaper,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  let stats = {
    totalProperties: 0,
    totalClients: 0,
    totalVisits: 0,
    totalUsers: 0,
    totalArticles: 0,
    totalTestimonials: 0,
    totalNewsletterSubscribers: 0,
    totalPropertyReviews: 0,
    totalArticleComments: 0,
    totalCommissions: 0,
    totalFinancings: 0,
    commissionsValue: 0,
    financingsValue: 0,
    latestProperties: [],
    latestVisits: [],
    latestClients: [],
    latestArticles: [],
    latestCommissions: [],
    latestFinancings: [],
    totalRevenue: 0,
    totalExpenses: 0,
  };

  try {
    // Contar registros de forma segura
    stats.totalProperties = await prisma.property.count();
    stats.totalClients = await prisma.client.count();
    stats.totalVisits = await prisma.visit.count();
    stats.totalUsers = await prisma.user.count();
    stats.totalArticles = await prisma.article.count();
    stats.totalTestimonials = await prisma.testimonial.count();
    stats.totalNewsletterSubscribers =
      await prisma.newsletterSubscription.count();
    stats.totalPropertyReviews = await prisma.propertyReview.count();
    stats.totalArticleComments = await prisma.articleComment.count();
    stats.totalCommissions = await prisma.commission.count();
    stats.totalFinancings = await prisma.financing.count();

    // Buscar valores de comissões e financiamentos
    const commissionsSum = await prisma.commission.aggregate({
      _sum: { commissionValue: true }
    });
    stats.commissionsValue = commissionsSum._sum.commissionValue || 0;

    const financingsSum = await prisma.financing.aggregate({
      _sum: { financedAmount: true }
    });
    stats.financingsValue = financingsSum._sum.financedAmount || 0;

    // Buscar registros recentes
    stats.latestProperties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    stats.latestVisits = await prisma.visit.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        client: { select: { name: true } },
      },
    });

    stats.latestClients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    stats.latestArticles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        author: { select: { name: true } },
      },
    });

    stats.latestCommissions = await prisma.commission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: { select: { title: true } },
        agent: { select: { name: true } },
      },
    });

    stats.latestFinancings = await prisma.financing.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: { select: { title: true } },
        client: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    // Cálculos financeiros
    const revenueRecords = await prisma.financialRecord.findMany({
      where: { type: "INCOME" },
    });
    const expenseRecords = await prisma.financialRecord.findMany({
      where: { type: "EXPENSE" },
    });

    stats.totalRevenue = revenueRecords.reduce(
      (sum, record) => sum + record.amount,
      0,
    );
    stats.totalExpenses = expenseRecords.reduce(
      (sum, record) => sum + record.amount,
      0,
    );
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
  }

  const netProfit = stats.totalRevenue - stats.totalExpenses;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Imóveis
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Imóveis cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Clientes registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">Visitas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">Receitas - Despesas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Usuários do sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artigos</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">Posts no blog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalNewsletterSubscribers}
            </div>
            <p className="text-xs text-muted-foreground">Inscritos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPropertyReviews}
            </div>
            <p className="text-xs text-muted-foreground">Reviews de imóveis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Imóveis</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.latestProperties.length === 0 ? (
              <p className="text-muted-foreground">Nenhum imóvel cadastrado.</p>
            ) : (
              <ul className="space-y-2">
                {stats.latestProperties.map((property) => (
                  <li
                    key={property.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {property.title} - {property.city}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(property.price)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.latestClients.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum cliente cadastrado.
              </p>
            ) : (
              <ul className="space-y-2">
                {stats.latestClients.map((client) => (
                  <li
                    key={client.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {client.name} ({client.email})
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(client.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Artigos</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.latestArticles.length === 0 ? (
              <p className="text-muted-foreground">Nenhum artigo publicado.</p>
            ) : (
              <ul className="space-y-2">
                {stats.latestArticles.map((article) => (
                  <li
                    key={article.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">{article.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(article.createdAt, "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestão Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/admin/imoveis/new" className="block">
                <div className="text-sm text-primary hover:underline">
                  + Adicionar Imóvel
                </div>
              </Link>
              <Link href="/admin/usuarios/new" className="block">
                <div className="text-sm text-primary hover:underline">
                  + Adicionar Usuário
                </div>
              </Link>
              <Link href="/admin/blog/new" className="block">
                <div className="text-sm text-primary hover:underline">
                  + Criar Artigo
                </div>
              </Link>
              <Link href="/admin/leads/new" className="block">
                <div className="text-sm text-primary hover:underline">
                  + Adicionar Lead
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
