import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Home, Calendar, MessageCircle, Star, Mail, Newspaper } from "lucide-react" // Adicionado Newspaper
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function AdminDashboard() {
  const totalProperties = await prisma.property.count()
  const totalClients = await prisma.client.count()
  const totalVisits = await prisma.visit.count()
  const totalUsers = await prisma.user.count()
  const totalArticles = await prisma.article.count()
  const totalTestimonials = await prisma.testimonial.count()
  const totalNewsletterSubscribers = await prisma.newsletterSubscription.count()
  const totalPropertyReviews = await prisma.propertyReview.count() // Novo
  const totalArticleComments = await prisma.articleComment.count() // Novo

  const latestProperties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const latestVisits = await prisma.visit.findMany({
    orderBy: { dataHora: "desc" },
    take: 5,
    include: { property: { select: { titulo: true } }, client: { select: { nome: true } } },
  })

  const latestLeads = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const latestTestimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const latestReviews = await prisma.propertyReview.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { property: { select: { titulo: true } }, user: { select: { name: true } } },
  })

  const latestComments = await prisma.articleComment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { article: { select: { title: true } }, user: { select: { name: true } } },
  })

  // Cálculo financeiro real (se houver dados)
  const totalRevenueRecord = await prisma.financialRecord.aggregate({
    _sum: { valor: true },
    where: { tipo: "Receita" },
  })
  const totalExpensesRecord = await prisma.financialRecord.aggregate({
    _sum: { valor: true },
    where: { tipo: "Despesa" },
  })

  const totalRevenue = totalRevenueRecord._sum.valor || 0
  const totalExpenses = totalExpensesRecord._sum.valor || 0
  const netProfit = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">Imóveis cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes/Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Leads e clientes registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground">Visitas totais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">Receitas - Despesas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Registrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total de usuários (incluindo admins)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artigos Publicados</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground">Posts no blog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depoimentos</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTestimonials}</div>
            <p className="text-xs text-muted-foreground">Depoimentos recebidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscritos Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNewsletterSubscribers}</div>
            <p className="text-xs text-muted-foreground">Assinantes da newsletter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações de Imóveis</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPropertyReviews}</div>
            <p className="text-xs text-muted-foreground">Avaliações de imóveis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comentários no Blog</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticleComments}</div>
            <p className="text-xs text-muted-foreground">Comentários em artigos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Imóveis Adicionados</CardTitle>
          </CardHeader>
          <CardContent>
            {latestProperties.length === 0 ? (
              <p className="text-muted-foreground">Nenhum imóvel adicionado recentemente.</p>
            ) : (
              <ul className="space-y-2">
                {latestProperties.map((property) => (
                  <li key={property.id} className="flex justify-between items-center">
                    <span>
                      <Link href={`/admin/imoveis/${property.id}/edit`} className="text-primary hover:underline">
                        {property.titulo}
                      </Link>{" "}
                      - {property.localizacao}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(property.preco)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Visitas</CardTitle>
          </CardHeader>
          <CardContent>
            {latestVisits.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma visita agendada para breve.</p>
            ) : (
              <ul className="space-y-2">
                {latestVisits.map((visit) => (
                  <li key={visit.id} className="flex justify-between items-center">
                    <span>
                      <Link href={`/admin/visitas/${visit.id}/edit`} className="text-primary hover:underline">
                        {visit.client.nome}
                      </Link>{" "}
                      para {visit.property.titulo}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(visit.dataHora, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {latestLeads.length === 0 ? (
              <p className="text-muted-foreground">Nenhum lead recente.</p>
            ) : (
              <ul className="space-y-2">
                {latestLeads.map((lead) => (
                  <li key={lead.id} className="flex justify-between items-center">
                    <span>
                      <Link href={`/admin/leads/${lead.id}/edit`} className="text-primary hover:underline">
                        {lead.nome}
                      </Link>{" "}
                      ({lead.email})
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(lead.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Depoimentos</CardTitle>
          </CardHeader>
          <CardContent>
            {latestTestimonials.length === 0 ? (
              <p className="text-muted-foreground">Nenhum depoimento recente.</p>
            ) : (
              <ul className="space-y-2">
                {latestTestimonials.map((testimonial) => (
                  <li key={testimonial.id} className="flex justify-between items-center">
                    <span>
                      <Link href={`/admin/depoimentos/${testimonial.id}/edit`} className="text-primary hover:underline">
                        {testimonial.authorName}
                      </Link>{" "}
                      ({testimonial.approved ? "Aprovado" : "Pendente"})
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(testimonial.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Avaliações de Imóveis</CardTitle>
          </CardHeader>
          <CardContent>
            {latestReviews.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma avaliação de imóvel recente.</p>
            ) : (
              <ul className="space-y-2">
                {latestReviews.map((review) => (
                  <li key={review.id} className="flex justify-between items-center">
                    <span>
                      <Link href={`/admin/imoveis/${review.property.id}/edit`} className="text-primary hover:underline">
                        {review.property.titulo}
                      </Link>{" "}
                      por {review.user.name || review.user.email}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(review.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Comentários no Blog</CardTitle>
          </CardHeader>
          <CardContent>
            {latestComments.length === 0 ? (
              <p className="text-muted-foreground">Nenhum comentário recente no blog.</p>
            ) : (
              <ul className="space-y-2">
                {latestComments.map((comment) => (
                  <li key={comment.id} className="flex justify-between items-center">
                    <span>
                      <Link href={`/admin/blog/${comment.article.slug}/edit`} className="text-primary hover:underline">
                        {comment.article.title}
                      </Link>{" "}
                      por {comment.user.name || comment.user.email}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(comment.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
