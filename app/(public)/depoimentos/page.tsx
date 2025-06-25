import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createTestimonial } from "@/app/actions/testimonial-actions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { nome: true } } },
  })

  const session = await getServerSession(authOptions)

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight text-center mb-10">O que nossos clientes dizem</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground col-span-full">Nenhum depoimento aprovado ainda.</p>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Por {testimonial.authorName} em {format(testimonial.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Deixe seu Depoimento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTestimonial} className="space-y-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium">
                Seu Nome
              </label>
              <Input type="text" id="authorName" name="authorName" defaultValue={session?.user?.name || ""} required />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium">
                Seu Depoimento
              </label>
              <Textarea id="content" name="content" rows={5} required />
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium">
                Avaliação (1-5 Estrelas)
              </label>
              <Input type="number" id="rating" name="rating" min="1" max="5" defaultValue={5} required />
            </div>
            <Button type="submit">Enviar Depoimento</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
