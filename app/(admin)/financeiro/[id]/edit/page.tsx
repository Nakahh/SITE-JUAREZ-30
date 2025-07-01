import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateFinancialRecord } from "@/app/actions/financial-actions";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";

const prisma = new PrismaClient();

export default async function EditFinancialRecordPage({
  params,
}: {
  params: { id: string };
}) {
  const record = await prisma.financialRecord.findUnique({
    where: { id: params.id },
  });

  if (!record) {
    notFound();
  }

  // Formatar a data para o formato de input type="date"
  const formattedDate = format(record.date, "yyyy-MM-dd");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Registro Financeiro</h1>
      <form
        action={updateFinancialRecord.bind(null, record.id)}
        className="space-y-4 max-w-lg"
      >
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium">
            Descrição (Opcional)
          </label>
          <Textarea
            id="descricao"
            name="descricao"
            defaultValue={record.description || ""}
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="valor" className="block text-sm font-medium">
            Valor (R$)
          </label>
          <Input
            type="number"
            id="valor"
            name="valor"
            step="0.01"
            defaultValue={record.amount.toString()}
            required
          />
        </div>
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium">
            Tipo
          </label>
          <Select name="tipo" defaultValue={record.type} required>
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
          <Input
            type="date"
            id="data"
            name="data"
            defaultValue={formattedDate}
            required
          />
        </div>
        <Button type="submit">Atualizar Registro</Button>
      </form>
    </div>
  );
}
