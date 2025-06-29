import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Calendar } from "lucide-react"

export const dynamic = "force-dynamic" // Adicionado para evitar erro de conexão com DB no build

const prisma = new PrismaClient()

export default async function DepoimentosPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      approved: true, // Apenas depoimentos aprovados
    },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">O que nossos clientes dizem</h1>
      {testimonials.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum depoimento disponível ainda.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card className="overflow-hidden" key={testimonial.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.user.image || "/placeholder-user.jpg"} />
                  <AvatarFallback>{testimonial.user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{testimonial.user.name || "Cliente Anônimo"}</CardTitle>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </CardContent>
              <CardFooter className="pt-0 pb-6 px-6">
                <Button className="w-full btn-siqueira">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Visita
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}