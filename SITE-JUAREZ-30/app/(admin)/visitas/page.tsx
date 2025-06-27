import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, PlusCircle } from "lucide-react"
import { deleteVisit } from "@/app/actions/visit-actions"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const dynamic = "force-dynamic" // Adicionado para evitar erro de conexão com DB no build

const prisma = new PrismaClient()

// Componente cliente para o AlertDialog
function DeleteVisitDialog({ visitId }: { visitId: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente esta visita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteVisit.bind(null, visitId)}>
            <AlertDialogAction type="submit">Excluir</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default async function AdminVisitas() {
  const visits = await prisma.visit.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      client: {
        select: { name: true, email: true },
      },
      property: {
        select: { title: true, address: true },
      },
    },
    orderBy: {
      date: "desc",
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Visitas</h1>
        <Link href="/admin/visitas/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Agendar Nova Visita
          </Button>
        </Link>
      </div>

      {visits.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhuma visita agendada ainda.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Imóvel</TableHead>
              <TableHead>Cliente/Usuário</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>{format(visit.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>
                  {visit.property?.title} ({visit.property?.address})
                </TableCell>
                <TableCell>
                  {visit.user ? `${visit.user.name || visit.user.email} (Usuário)` : ""}
                  {visit.client ? `${visit.client.name || visit.client.email} (Lead)` : ""}
                </TableCell>
                <TableCell>{visit.notes || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/admin/visitas/${visit.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </Link>
                    <DeleteVisitDialog visitId={visit.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
