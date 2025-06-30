"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToFavoritesButton } from "@/components/add-to-favorites-button"
import { 
  Bed, 
  Bath, 
  Square, 
  Car, 
  MapPin, 
  Calendar,
  Eye,
  Heart,
  Share2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    type: string
    status: string
    address: string
    city: string
    state: string
    bedrooms: number
    bathrooms: number
    area: number
    garage: boolean
    images?: string[] | null
    createdAt: Date
    agent?: {
      id: string
      name: string | null
      image: string | null
    } | null
  }
  userId?: string
  className?: string
}

export function PropertyCard({ property, userId, className }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = Array.isArray(property.images) ? property.images : []
  const hasImages = images.length > 0
  const currentImage = hasImages ? images[currentImageIndex] : null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FOR_SALE':
      case 'AVAILABLE':
        return 'bg-green-500'
      case 'FOR_RENT':
        return 'bg-blue-500'
      case 'SOLD':
        return 'bg-red-500'
      case 'RENTED':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'FOR_SALE':
      case 'AVAILABLE':
        return 'À Venda'
      case 'FOR_RENT':
        return 'Para Alugar'
      case 'SOLD':
        return 'Vendido'
      case 'RENTED':
        return 'Alugado'
      default:
        return status
    }
  }

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300 overflow-hidden", className)}>
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden">
        {hasImages && currentImage && !imageError ? (
          <Image
            src={currentImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-center">
              <Square className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sem imagem</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <Badge 
          className={cn(
            "absolute top-2 left-2 text-white border-0",
            getStatusColor(property.status)
          )}
        >
          {getStatusText(property.status)}
        </Badge>

        {/* Navegação de imagens */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentImageIndex(index)
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Ações rápidas */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {userId && <AddToFavoritesButton propertyId={property.id} userId={userId} />}
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Preço */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(property.price)}
          </p>
          <Badge variant="outline">{property.type}</Badge>
        </div>

        {/* Título */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Localização */}
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{property.address}, {property.city} - {property.state}</span>
        </div>

        {/* Características */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area}m²</span>
            </div>
            {property.garage && (
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-1" />
                <span>Garagem</span>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {property.description}
        </p>

        {/* Informações do corretor */}
        {property.agent && (
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <div className="flex items-center">
              {property.agent.image ? (
                <Image
                  src={property.agent.image}
                  alt={property.agent.name || 'Corretor'}
                  width={20}
                  height={20}
                  className="rounded-full mr-2"
                  sizes="20px"
                />
              ) : (
                <div className="w-5 h-5 bg-muted rounded-full mr-2 flex items-center justify-center">
                  <span className="text-xs">
                    {property.agent.name?.charAt(0) || 'C'}
                  </span>
                </div>
              )}
              <span>Corretor: {property.agent.name}</span>
            </div>
          </div>
        )}

        {/* Data de cadastro */}
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Cadastrado em {new Date(property.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
        {/* Botões de ação */}
        <div className="flex space-x-2 w-full">
          <Button asChild className="flex-1">
            <Link href={`/imoveis/${property.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${formatPrice(property.price)}`
              const whatsappUrl = `https://wa.me/5562985563905?text=${encodeURIComponent(message)}`
              window.open(whatsappUrl, '_blank')
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Visita
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PropertyCard