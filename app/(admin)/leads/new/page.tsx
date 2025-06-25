import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/app/actions/client-actions"

export default function NewLeadPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Lead</h1>
      <form action={createClient} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium">
            Nome
          </label>
          <Input type="text" id="nome" name="nome" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium">
            Telefone (Opcional)
          </label>
          <Input type="tel" id="telefone" name="telefone" />
        </div>
        <Button type="submit">Salvar Lead</Button>
      </form>
    </div>
  )
}
