"use client"

import { PrismaClient } from "@prisma/client"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deletePropertyReview } from "@/app/actions/property-review-actions"
import { useToast } from "@/components/ui/use-toast"

const prisma = new PrismaClient()

export default async function MyReviewsPage() {
  const session = await auth()
  const { toast } = useToast()

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

  const reviews = await prisma.propertyReview.findMany({
    where: { userId: session.user.id },
    include: { property: { select: { titulo: true, localizacao: true, id: true } } },
    orderBy: { createdAt: "desc" },
  })

  const handleDelete = async (reviewId: string) => {
    const result = await deletePropertyReview(reviewId)
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      })
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight text-center mb-10">Minhas Avaliações de Imóveis</h1>

      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground">Você ainda não avaliou nenhum imóvel.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <Link href={`/imoveis/${review.property.id}`} className="hover:underline">
                    {review.property.titulo}
                  </Link>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{review.property.localizacao}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Avaliado em: {format(review.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                </p>
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
                <div className="flex gap-2 mt-4">
                  {/* Implementar edição se necessário, por enquanto apenas exclusão */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua avaliação.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(review.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
