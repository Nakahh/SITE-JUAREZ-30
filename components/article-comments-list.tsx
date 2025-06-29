import prisma from "@/lib/prisma";
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ArticleCommentsListProps {
  articleId: string
}

export async function ArticleCommentsList({ articleId }: ArticleCommentsListProps) {
  const comments = await prisma.articleComment.findMany({
    where: { articleId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  if (comments.length === 0) {
    return <p className="text-muted-foreground">Nenhum comentário para este artigo ainda.</p>
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
          <p className="font-semibold">{comment.user.name || comment.user.email}</p>
          <p className="text-sm text-muted-foreground">
            {format(comment.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </p>
          <p className="mt-2 text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}
