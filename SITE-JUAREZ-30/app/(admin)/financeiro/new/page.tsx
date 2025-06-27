import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createFinancialRecord } from "@/app/actions/financial-actions"

export default function NewFinancialRecordPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Registro Financeiro</h1>
      <form action={createFinancialRecord} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium">
            Descrição (Opcional)
          </label>
          <Textarea id="descricao" name="descricao" rows={3} />
        </div>
        <div>
          <label htmlFor="valor" className="block text-sm font-medium">
            Valor (R$)
          </label>
          <Input type="number" id="valor" name="valor" step="0.01" required />
        </div>
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium">
            Tipo
          </label>
          <Select name="tipo" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Receita">Receita</SelectItem>
              <SelectItem value="Despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="data" className="block text-sm font-medium">
            Data
          </label>
          <Input type="date" id="data" name="data" defaultValue={new Date().toISOString().split("T")[0]} required />
        </div>
        <Button type="submit">Salvar Registro</Button>
      </form>
    </div>
  )
}
