import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createArticle } from "@/app/actions/article-actions"

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Artigo</h1>
      <form action={createArticle} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium">
            Título
          </label>
          <Input type="text" id="titulo" name="titulo" required />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug (URL amigável, opcional)
          </label>
          <Input type="text" id="slug" name="slug" placeholder="Ex: meu-novo-artigo" />
        </div>
        <div>
          <label htmlFor="conteudo" className="block text-sm font-medium">
            Conteúdo
          </label>
          <Textarea id="conteudo" name="conteudo" rows={10} required />
        </div>
        <Button type="submit">Salvar Artigo</Button>
      </form>
    </div>
  )
}
