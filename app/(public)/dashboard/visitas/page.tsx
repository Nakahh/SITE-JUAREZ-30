import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const prisma = new PrismaClient();

export default async function ClientVisitsPage() {
  const session = await auth();

  if (
    !session?.user?.id ||
    session.user.role === "ADMIN" ||
    session.user.role === "AGENT"
  ) {
    redirect("/login");
  }

  const userId = session.user.id as string;

  const scheduledVisits = await prisma.visit.findMany({
    where: { userId: userId },
    include: { property: true },
    orderBy: { date: "asc" },
  });

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        Suas Visitas Agendadas
      </h1>

      {scheduledVisits.length === 0 ? (
        <p className="text-muted-foreground">
          Você não tem visitas agendadas.{" "}
          <Link href="/imoveis" className="text-primary hover:underline">
            Agende uma visita agora!
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {scheduledVisits.map((visit) => (
            <Card key={visit.id}>
              <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {visit.property.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Agendado para:{" "}
                    {format(visit.date, "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Status: {visit.status}
                  </p>
                </div>
                <Link href={`/imovel/${visit.property.id}`}>
                  <Button variant="outline" className="mt-2 md:mt-0">
                    Ver Imóvel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
