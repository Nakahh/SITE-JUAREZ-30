import Image from "next/image"
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { MapEmbed } from "@/components/map-embed"
import { Button } from "@/components/ui/button"
import { ScheduleVisitForm } from "@/components/schedule-visit-form"
import { AddToFavoritesButton } from "@/components/add-to-favorites-button"
import { AddToCompareButton } from "@/components/add-to-compare-button"
import { PropertyReviewForm } from "@/components/property-review-form" // Importar o formulário de avaliação
import { PropertyReviewsList } from "@/components/property-reviews-list" // Importar a lista de avaliações
import { auth } from "@/app/api/auth/[...nextauth]/route" // Para obter a sessão do usuário
import { Star } from "lucide-react" // Para exibir a média das estrelas

const prisma = new PrismaClient()

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      comodidades: true,
      agent: { select: { name: true, email: true, phone: true } }, // Incluir dados do corretor
      reviews: {
        select: { rating: true }, // Apenas para calcular a média
      },
    },
  })

  if (!property) {
    notFound()
  }

  // Calcular a média das avaliações
  const averageRating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length
      : 0
  const fullStars = Math.floor(averageRating)
  const hasHalfStar = averageRating - fullStars >= 0.5

  return (
    <section className="container py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
            {property.images.length > 0 ? (
              <Image
                src={property.images[0].url || "/placeholder.svg"}
                alt={property.titulo}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            ) : (
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Placeholder"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            )}
          </div>
          {property.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {property.images.slice(1, 5).map((image) => (
                <div key={image.id} className="relative h-24 w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={property.titulo}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{property.titulo}</h1>
          <div className="flex items-center gap-2 text-lg text-muted-foreground">
            <span>{property.localizacao}</span>
            <span className="mx-2">•</span>
            <span>{property.tipo}</span>
          </div>
          <div className="text-3xl font-bold text-primary">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(property.preco)}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
            {hasHalfStar && (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" style={{ clipPath: "inset(0 50% 0 0)" }} />
            )}
            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
              <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-5 w-5 text-gray-300" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">({property.reviews.length} avaliações)</span>
          </div>
          <p className="text-gray-700">{property.descricao}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Quartos:</p>
              <p>{property.quartos}</p>
            </div>
            <div>
              <p className="font-semibold">Banheiros:</p>
              <p>{property.banheiros}</p>
            </div>
            <div>
              <p className="font-semibold">Área:</p>
              <p>{property.area} m²</p>
            </div>
            <div>
              <p className="font-semibold">Vagas de Garagem:</p>
              <p>{property.garagem}</p>
            </div>
          </div>

          {property.comodidades && property.comodidades.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">Comodidades</h3>
              <div className="flex flex-wrap gap-2">
                {property.comodidades.map((comodidade) => (
                  <span
                    key={comodidade.id}
                    className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary"
                  >
                    {comodidade.nome}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.agent && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-bold mb-3">Corretor Responsável</h3>
              <p className="text-lg font-semibold">{property.agent.name}</p>
              <p className="text-muted-foreground">Email: {property.agent.email}</p>
              <p className="text-muted-foreground">Telefone: {property.agent.phone}</p>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <AddToFavoritesButton propertyId={property.id} />
            <AddToCompareButton propertyId={property.id} />
            <Button asChild>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Olá! Tenho interesse no imóvel: ${property.titulo} - ${property.localizacao}. Link: ${process.env.NEXT_PUBLIC_BASE_URL}/imoveis/${property.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com Corretor
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Localização</h2>
        <MapEmbed address={property.localizacao} />
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Agendar Visita</h2>
        <ScheduleVisitForm propertyId={property.id} propertyTitle={property.titulo} />
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Avaliações de Clientes</h2>
        <PropertyReviewForm propertyId={property.id} userId={session?.user?.id} />
        <div className="mt-8">
          <PropertyReviewsList propertyId={property.id} />
        </div>
      </div>
    </section>
  )
}
