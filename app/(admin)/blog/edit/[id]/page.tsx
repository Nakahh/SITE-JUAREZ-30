import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateArticle } from "@/app/actions/article-actions";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Artigo</h1>
      <form
        action={updateArticle.bind(null, article.id)}
        className="space-y-4 max-w-lg"
      >
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium">
            Título
          </label>
          <Input
            type="text"
            id="titulo"
            name="titulo"
            defaultValue={article.title}
            required
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug (URL amigável, opcional)
          </label>
          <Input
            type="text"
            id="slug"
            name="slug"
            defaultValue={article.slug || ""}
            placeholder="Ex: meu-novo-artigo"
          />
        </div>
        <div>
          <label htmlFor="conteudo" className="block text-sm font-medium">
            Conteúdo
          </label>
          <Textarea
            id="conteudo"
            name="conteudo"
            defaultValue={article.content || ""}
            rows={10}
            required
          />
        </div>
        <Button type="submit">Atualizar Artigo</Button>
      </form>
    </div>
  );
}
