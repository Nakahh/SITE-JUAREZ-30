import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArticleCommentForm } from "@/components/article-comment-form"; // Importar o formulário de comentário
import { ArticleCommentsList } from "@/components/article-comments-list"; // Importar a lista de comentários
import { auth } from "@/lib/auth"; // Para obter a sessão do usuário

const prisma = new PrismaClient();

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <article className="container py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <div className="text-muted-foreground text-sm mb-6">
        Por {article.author?.name || "Autor Desconhecido"} em{" "}
        {format(article.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </div>

      {article.imageUrl && (
        <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-12 border-t pt-8">
        <h2 className="text-3xl font-bold mb-6">Comentários</h2>
        <ArticleCommentForm articleId={article.id} userId={session?.user?.id} />
        <div className="mt-8">
          <ArticleCommentsList articleId={article.id} />
        </div>
      </div>
    </article>
  );
}
