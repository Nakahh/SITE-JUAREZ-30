import { Button } from "@/components/ui/button"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export const dynamic = "force-dynamic" // Adicionado para evitar erro de conexão com DB no build

const prisma = new PrismaClient()

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Nosso Blog</h1>
      {articles.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum artigo publicado ainda.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  <Link href={`/blog/${article.id}`} className="hover:underline">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Por {article.author.name || "Autor Desconhecido"} em{" "}
                  {format(article.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{article.content}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href={`/blog/${article.id}`}>
                  <Button variant="outline">Ler Mais</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
