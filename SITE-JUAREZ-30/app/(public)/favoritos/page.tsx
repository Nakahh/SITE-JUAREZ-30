import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PropertyCard } from "@/components/property-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const prisma = new PrismaClient()

export default async function FavoritosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return (
      <section className="container py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Meus Imóveis Favoritos</h1>
        <p className="text-muted-foreground mb-6">Você precisa estar logado para ver seus imóveis favoritos.</p>
        <Link href="/login">
          <Button>Fazer Login</Button>
        </Link>
      </section>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return (
      <section className="container py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Meus Imóveis Favoritos</h1>
        <p className="text-muted-foreground mb-6">
          Ocorreu um erro ao carregar seu perfil. Por favor, tente novamente.
        </p>
      </section>
    )
  }

  const favoriteProperties = await prisma.favoriteProperty.findMany({
    where: { userId: user.id },
    include: { property: true }, // Inclui os dados completos do imóvel
    orderBy: { createdAt: "desc" },
  })

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Meus Imóveis Favoritos</h1>

      {favoriteProperties.length === 0 ? (
        <p className="text-center text-muted-foreground">Você ainda não favoritou nenhum imóvel.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((fav) => (
            <PropertyCard key={fav.property.id} {...fav.property} />
          ))}
        </div>
      )}
    </section>
  )
}
