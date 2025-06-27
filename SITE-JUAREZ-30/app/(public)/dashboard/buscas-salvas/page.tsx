import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteSavedSearch, createSavedSearch } from "@/app/actions/saved-search-actions"
import { Trash2, PlusCircle } from "lucide-react"
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
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const prisma = new PrismaClient()

function DeleteSavedSearchDialog({ searchId }: { searchId: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir busca salva</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente esta busca salva e você não receberá mais
            alertas para ela.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteSavedSearch.bind(null, searchId)}>
            <AlertDialogAction type="submit">Excluir</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default async function SavedSearchesPage() {
  const session = await getServerSession(authOptions)

  if (
    !session?.user?.id ||
    session.papel === "ADMIN" ||
    session.papel === "CORRETOR" ||
    session.papel === "ASSISTENTE"
  ) {
    redirect("/login")
  }

  const userId = session.user.id as string

  const savedSearches = await prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Suas Buscas Salvas e Alertas</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Criar Nova Busca Salva</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSavedSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input type="text" name="search" placeholder="Palavra-chave (título, localização)" />
            <Select name="tipo">
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Imóvel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qualquer">Qualquer Tipo</SelectItem>
                <SelectItem value="Apartamento">Apartamento</SelectItem>
                <SelectItem value="Casa">Casa</SelectItem>
                <SelectItem value="Terreno">Terreno</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" name="minPreco" placeholder="Preço Mín. (R$)" step="any" />
            <Input type="number" name="maxPreco" placeholder="Preço Máx. (R$)" step="any" />
            <Input type="number" name="quartos" placeholder="Quartos" />
            <Input type="number" name="minArea" placeholder="Área Mín. (m²)" step="any" />
            <Input
              type="text"
              name="comodidades"
              placeholder="Comodidades (separadas por vírgula)"
              className="lg:col-span-2"
            />
            <Button type="submit" className="lg:col-span-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Salvar Busca
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-3xl font-bold tracking-tight mb-6">Suas Buscas Salvas</h2>
      {savedSearches.length === 0 ? (
        <p className="text-muted-foreground">
          Você ainda não salvou nenhuma busca. Salve uma busca para receber alertas de novos imóveis!
        </p>
      ) : (
        <div className="space-y-4">
          {savedSearches.map((search) => (
            <Card key={search.id}>
              <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Busca Salva #{search.id.substring(0, 8)}</h3>
                  <p className="text-muted-foreground text-sm">Critérios: {JSON.stringify(search.searchParams)}</p>
                  <p className="text-muted-foreground text-sm">
                    Salva em: {format(search.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                  {search.lastNotifiedAt && (
                    <p className="text-muted-foreground text-sm">
                      Última notificação: {format(search.lastNotifiedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  )}
                </div>
                <DeleteSavedSearchDialog searchId={search.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
