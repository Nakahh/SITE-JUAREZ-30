import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth"; // Importação corrigida
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Search,
  Calendar,
  Star,
  Users,
  MessageSquare,
} from "lucide-react";
import { WhatsAppIntegrationCard } from "@/components/whatsapp-integration-card";
import { LeadsCard } from "@/components/leads-card";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic"; // Adicionado para evitar erro de conexão com DB no build

const prisma = new PrismaClient();

export default async function ClientDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold">Acesso Negado</h1>
        <p className="mt-4 text-muted-foreground">
          Por favor, faça login para acessar seu dashboard.
        </p>
        <Link href="/login">
          <Button className="mt-6">Fazer Login</Button>
        </Link>
      </div>
    );
  }

  const userId = session.user.id;

  const totalFavorites = await prisma.favoriteProperty.count({
    where: { userId },
  });
  const totalSavedSearches = await prisma.savedSearch.count({
    where: { userId },
  });
  const totalVisits = await prisma.visit.count({ where: { userId } }); // Alterado de clientId para userId
  const totalReviews = await prisma.propertyReview.count({ where: { userId } });

  // Dados específicos para corretores
  const isAgent =
    session.user.role === "AGENT" || session.user.role === "ADMIN";
  let agentData = null;

  if (isAgent) {
    const totalLeads = await prisma.lead.count({
      where: { agentId: userId },
    });
    const pendingLeads = await prisma.lead.count({
      where: { agentId: userId, status: "PENDING" },
    });
    const assumedLeads = await prisma.lead.count({
      where: { agentId: userId, status: "ASSUMED" },
    });
    const totalProperties = await prisma.property.count({
      where: { agentId: userId },
    });

    agentData = {
      totalLeads,
      pendingLeads,
      assumedLeads,
      totalProperties,
    };
  }

  const recentFavorites = await prisma.favoriteProperty.findMany({
    where: { userId },
    include: {
      property: {
        select: { title: true, address: true, price: true, images: true },
      },
    }, // Corrigido para 'title' e 'address'
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const upcomingVisits = await prisma.visit.findMany({
    where: { userId, date: { gte: new Date() } }, // Alterado de clientId para userId e adicionado filtro de data
    include: { property: { select: { title: true, address: true } } }, // Corrigido para 'title' e 'address'
    orderBy: { date: "asc" },
    take: 3,
  });

  return (
    <div className="container py-12 space-y-8">
      <h1 className="text-4xl font-bold">
        Bem-vindo, {session.user.name || session.user.email}!
      </h1>
      <p className="text-muted-foreground">
        Aqui você pode gerenciar suas atividades no site.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Imóveis Favoritos
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFavorites}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/favoritos" className="text-primary hover:underline">
                Ver todos
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buscas Salvas</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSavedSearches}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                href="/dashboard/buscas-salvas"
                className="text-primary hover:underline"
              >
                Gerenciar
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visitas Agendadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                href="/dashboard/visitas"
                className="text-primary hover:underline"
              >
                Ver detalhes
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Minhas Avaliações
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                href="/dashboard/minhas-avaliacoes"
                className="text-primary hover:underline"
              >
                Gerenciar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-semibold">Nome:</span>{" "}
              {session.user.name || "Não informado"}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {session.user.email}
            </p>
            <p>
              <span className="font-semibold">Papel:</span> {session.user.role}
            </p>
            <Link href="/dashboard/perfil">
              <Button variant="outline" className="mt-4">
                Editar Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            {recentFavorites.length === 0 ? (
              <p className="text-muted-foreground">
                Você ainda não adicionou nenhum imóvel aos favoritos.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentFavorites.map((fav) => (
                  <li key={fav.id} className="flex items-center gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                      {fav.property.images.length > 0 ? (
                        <Image
                          src={fav.property.images[0] || "/placeholder.svg"} // Assumindo que images é um array de strings de URL
                          alt={fav.property.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Placeholder"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/imoveis/${fav.property.id}`}
                        className="font-semibold hover:underline"
                      >
                        {fav.property.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {fav.property.address}
                      </p>
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(fav.property.price)}
                      </p>
                    </div>
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
            {upcomingVisits.length === 0 ? (
              <p className="text-muted-foreground">
                Você não tem visitas agendadas.
              </p>
            ) : (
              <ul className="space-y-3">
                {upcomingVisits.map((visit) => (
                  <li key={visit.id}>
                    <p className="font-semibold">
                      {visit.property?.title} em {visit.property?.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Data:{" "}
                      {format(visit.date, "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                    {/* Removido status, pois não está no schema de Visit */}
                    <Link href={`/dashboard/visitas?id=${visit.id}`}>
                      <Button variant="link" className="p-0 h-auto">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
