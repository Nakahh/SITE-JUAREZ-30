import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, PlusCircle } from "lucide-react"
import { deleteArticle } from "@/app/actions/article-actions"

const prisma = new PrismaClient()

export default async function AdminBlog() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Artigos do Blog</h1>
        <Link href="/admin/blog/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Artigo
          </Button>
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum artigo cadastrado ainda.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.titulo}</TableCell>
                <TableCell>{article.slug}</TableCell>
                <TableCell>{new Date(article.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/admin/blog/${article.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </Link>
                    <form action={deleteArticle.bind(null, article.id)}>
                      <Button variant="destructive" size="icon" type="submit">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
