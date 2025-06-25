import Link from "next/link"
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const prisma = new PrismaClient()

export default async function Blog() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Blog</h1>
      <p className="mt-4 text-muted-foreground mb-8">Artigos sobre o mercado imobiliário, dicas e novidades.</p>

      {articles.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum artigo publicado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{article.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Publicado em: {new Date(article.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{article.conteudo}</p>
                <Link href={`/blog/${article.slug}`} className="text-primary hover:underline mt-2 inline-block">
                  Leia mais
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
