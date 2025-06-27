import { Button } from "@/components/ui/button"
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic" // Adicionado para evitar erro de conexão com DB no build

const prisma = new PrismaClient()

export default async function CorretoresPage() {
  const agents = await prisma.user.findMany({
    where: {
      role: "AGENT", // Filtrar apenas corretores
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Nossos Corretores</h1>
      {agents.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum corretor cadastrado ainda.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="flex flex-col items-center text-center p-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={agent.image || "/placeholder-user.jpg"}
                  alt={agent.name || "Corretor"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">{agent.name || "Nome Indisponível"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{agent.email}</p>
                {/* Adicionar mais informações do corretor se disponíveis no modelo Prisma */}
                <Link href={`/corretores/${agent.id}`} className="mt-4 inline-block">
                  <Button variant="outline">Ver Perfil</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
