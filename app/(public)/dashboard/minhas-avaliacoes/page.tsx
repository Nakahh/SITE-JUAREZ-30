import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth" // Importação corrigida
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic" // Adicionado para evitar erro de conexão com DB no build

const prisma = new PrismaClient()

export default async function MinhasAvaliacoesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold">Acesso Negado</h1>
        <p className="mt-4 text-muted-foreground">Por favor, faça login para acessar suas avaliações.</p>
        <Link href="/login">
          <Button className="mt-6">Fazer Login</Button>
        </Link>
      </div>
    )
  }

  const userId = session.user.id

  const reviews = await prisma.propertyReview.findMany({
    where: { userId },
    include: {
      property: {
        select: { title: true, address: true, id: true }, // Corrigido para 'title' e 'address'
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Minhas Avaliações de Imóveis</h1>

      <Card>
        <CardHeader>
          <CardTitle>Suas Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">Você ainda não fez nenhuma avaliação de imóvel.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Comentário</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <Link href={`/imoveis/${review.property.id}`} className="font-medium hover:underline">
                        {review.property.title} ({review.property.address})
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{review.comment || "N/A"}</TableCell>
                    <TableCell>{format(review.createdAt, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
