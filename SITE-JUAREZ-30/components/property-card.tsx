import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, BedSingle, Ruler } from "lucide-react" // Adicionado CheckCircle
import { AddToFavoritesButton } from "./add-to-favorites-button"
import { AddToCompareButton } from "./add-to-compare-button"

interface PropertyCardProps {
  id: string
  titulo: string
  preco: number
  tipo: string
  quartos: number
  area: number
  localizacao: string
  imageUrls?: string[]
  comodidades?: string[]
}

export function PropertyCard({
  id,
  titulo,
  preco,
  tipo,
  quartos,
  area,
  localizacao,
  imageUrls,
  comodidades,
}: PropertyCardProps) {
  const displayImageUrl = imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/placeholder.svg?height=200&width=300"

  const propertyData = { id, titulo, preco, tipo, quartos, area, localizacao, imageUrl: displayImageUrl }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <Image
          src={displayImageUrl || "/placeholder.svg"}
          alt={titulo}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-t-md"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold">{titulo}</CardTitle>
        <p className="text-muted-foreground text-sm">{localizacao}</p>
        {comodidades && comodidades.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-semibold">Comodidades:</span> {comodidades.slice(0, 3).join(", ")}
            {comodidades.length > 3 && "..."}
          </div>
        )}
        <div className="mt-2 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-1 text-primary" />
            <span>{tipo}</span>
          </div>
          <div className="flex items-center">
            <BedSingle className="h-4 w-4 mr-1 text-primary" />
            <span>{quartos} Quartos</span>
          </div>
          <div className="flex items-center">
            <Ruler className="h-4 w-4 mr-1 text-primary" />
            <span>{area}m²</span>
          </div>
        </div>
        <p className="mt-4 text-2xl font-bold text-primary">
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preco)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Link href={`/imoveis/${id}`} className="w-full">
          <Button className="w-full">Ver Detalhes</Button>
        </Link>
        <div className="flex w-full gap-2">
          <AddToFavoritesButton propertyId={id} />
          <AddToCompareButton property={propertyData} />
        </div>
      </CardFooter>
    </Card>
  )
}
