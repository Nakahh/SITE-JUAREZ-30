import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateClient } from "@/app/actions/client-actions";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function EditLeadPage({
  params,
}: {
  params: { id: string };
}) {
  const lead = await prisma.client.findUnique({
    where: { id: params.id },
  });

  if (!lead) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Lead</h1>
      <form
        action={updateClient.bind(null, lead.id)}
        className="space-y-4 max-w-lg"
      >
        <div>
          <label htmlFor="nome" className="block text-sm font-medium">
            Nome
          </label>
          <Input
            type="text"
            id="nome"
            name="nome"
            defaultValue={lead.name}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            defaultValue={lead.email}
            required
          />
        </div>
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium">
            Telefone (Opcional)
          </label>
          <Input
            type="tel"
            id="telefone"
            name="telefone"
            defaultValue={lead.phone || ""}
          />
        </div>
        <Button type="submit">Atualizar Lead</Button>
      </form>
    </div>
  );
}
