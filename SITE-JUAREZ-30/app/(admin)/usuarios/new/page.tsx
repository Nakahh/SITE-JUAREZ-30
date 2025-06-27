import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUser } from "@/app/actions/user-actions"
import { Role } from "@prisma/client" // Importar o enum Role

export default function NewUserPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Usuário</h1>
      <form action={createUser} className="space-y-4 max-w-lg">
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
          <label htmlFor="password" className="block text-sm font-medium">
            Senha
          </label>
          <Input type="password" id="password" name="password" required />
        </div>
        <div>
          <label htmlFor="papel" className="block text-sm font-medium">
            Papel
          </label>
          <Select name="papel" defaultValue={Role.USER} required>
            {" "}
            {/* Corrigido para Role.USER */}
            <SelectTrigger>
              <SelectValue placeholder="Selecione o papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Role.USER}>Usuário Comum</SelectItem>
              <SelectItem value={Role.AGENT}>Corretor</SelectItem>
              <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Salvar Usuário</Button>
      </form>
    </div>
  )
}
