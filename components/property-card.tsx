
"use client"

import Image from "next/image"
import Link from "next/link"
import { Property } from "@prisma/client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BedDouble, 
  Bath, 
  Square, 
  Car, 
  MapPin, 
  Heart,
  Share2,
  Eye
} from "lucide-react"
import AddToFavoritesButton from "./add-to-favorites-button"

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getFirstImage = () => {
    if (typeof property.images === 'string') {
      try {
        const images = JSON.parse(property.images)
        return Array.isArray(images) && images.length > 0 ? images[0] : '/placeholder.jpg'
      } catch {
        return '/placeholder.jpg'
      }
    }
    if (Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0]
    }
    return '/placeholder.jpg'
  }

  return (
    <Card className="property-card overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={getFirstImage()}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge de tipo */}
        <Badge 
          className="absolute top-3 left-3 bg-primary text-primary-foreground"
          variant="default"
        >
          {property.type === 'SALE' ? 'Venda' : 'Aluguel'}
        </Badge>

        {/* Botões de ação no hover */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Preço destacado */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/95 text-primary font-bold text-sm px-3 py-1">
            {formatPrice(property.price)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">
                {property.neighborhood}, {property.city}
              </span>
            </div>
          </div>

          {/* Características do imóvel */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {property.bedrooms && property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4 icon-primary" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && property.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4 icon-primary" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              {property.area && property.area > 0 && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4 icon-primary" />
                  <span>{property.area}m²</span>
                </div>
              )}
              {property.parkingSpaces && property.parkingSpaces > 0 && (
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4 icon-primary" />
                  <span>{property.parkingSpaces}</span>
                </div>
              )}
            </div>
          </div>

          {/* Descrição resumida */}
          {property.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {property.description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex w-full gap-2">
          <Button asChild className="flex-1 btn-primary">
            <Link href={`/imoveis/${property.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Link>
          </Button>
          <Button variant="outline" className="flex-1">
            Agendar Visita
          </Button>
        </div>
        
        {/* Informações adicionais */}
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
          <span>Cód: {property.id.slice(-6)}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            0 visualizações
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
