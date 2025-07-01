import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateVisit } from "@/app/actions/visit-actions";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";

const prisma = new PrismaClient();

export default async function EditVisitPage({
  params,
}: {
  params: { id: string };
}) {
  const visit = await prisma.visit.findUnique({
    where: { id: params.id },
    include: {
      property: { select: { id: true, title: true } },
      client: { select: { id: true, name: true, email: true } },
    },
  });

  if (!visit) {
    notFound();
  }

  const properties = await prisma.property.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  const clients = await prisma.client.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  // Formatar a data para o formato datetime-local
  const formattedDate = format(visit.date, "yyyy-MM-dd'T'HH:mm");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Visita</h1>
      <form
        action={updateVisit.bind(null, visit.id)}
        className="space-y-4 max-w-lg"
      >
        <div>
          <label htmlFor="propertyId" className="block text-sm font-medium">
            Imóvel
          </label>
          <Select name="propertyId" defaultValue={visit.propertyId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o imóvel" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium">
            Cliente
          </label>
          <Select name="clientId" defaultValue={visit.clientId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Data e Hora da Visita
          </label>
          <Input
            type="datetime-local"
            id="date"
            name="date"
            defaultValue={formattedDate}
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <Select name="status" defaultValue={visit.status} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Confirmada">Confirmada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
              <SelectItem value="Realizada">Realizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Atualizar Visita</Button>
      </form>
    </div>
  );
}
