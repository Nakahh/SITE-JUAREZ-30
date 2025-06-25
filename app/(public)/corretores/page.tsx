import { Button } from "@/components/ui/button"
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Image from "next/image"

const prisma = new PrismaClient()

export default async function AgentsPage() {
  const agents = await prisma.user.findMany({
    where: {
      papel: "CORRETOR",
    },
    select: {
      id: true,
      nome: true,
      email: true,
      image: true, // Para foto de perfil, se houver
    },
    orderBy: { nome: "asc" },
  })

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight text-center mb-10">Nossos Corretores Especialistas</h1>

      {agents.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum corretor cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="text-center">
              <CardHeader className="flex flex-col items-center">
                <Image
                  src={agent.image || "/placeholder.svg?height=100&width=100"}
                  alt={agent.nome || "Corretor"}
                  width={100}
                  height={100}
                  className="rounded-full object-cover mb-4"
                />
                <CardTitle className="text-xl font-bold">{agent.nome || "Corretor"}</CardTitle>
                <p className="text-muted-foreground text-sm">Corretor de Imóveis</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{agent.email}</span>
                </div>
                {/* Adicione um campo de telefone no modelo User se quiser exibir */}
                {/* <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>(XX) XXXX-XXXX</span>
                </div> */}
                <Button variant="outline" className="mt-4">
                  Entrar em Contato
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
