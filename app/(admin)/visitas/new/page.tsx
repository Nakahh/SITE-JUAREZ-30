import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { scheduleVisit } from "@/app/actions/visit-actions"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function NewVisitPage() {
  const properties = await prisma.property.findMany({
    select: { id: true, titulo: true },
    orderBy: { titulo: "asc" },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Agendar Nova Visita</h1>
      <form action={scheduleVisit} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="propertyId" className="block text-sm font-medium">
            Imóvel
          </label>
          <Select name="propertyId" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o imóvel" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium">
            Nome do Cliente
          </label>
          <Input type="text" id="clientName" name="clientName" required />
        </div>
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium">
            Email do Cliente
          </label>
          <Input type="email" id="clientEmail" name="clientEmail" required />
        </div>
        <div>
          <label htmlFor="clientPhone" className="block text-sm font-medium">
            Telefone do Cliente (Opcional)
          </label>
          <Input type="tel" id="clientPhone" name="clientPhone" />
        </div>
        <div>
          <label htmlFor="dataHora" className="block text-sm font-medium">
            Data e Hora da Visita
          </label>
          <Input type="datetime-local" id="dataHora" name="dataHora" required />
        </div>
        <Button type="submit">Agendar Visita</Button>
      </form>
    </div>
  )
}
