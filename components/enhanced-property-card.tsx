"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddToFavoritesButton } from "@/components/add-to-favorites-button";
import { VisitScheduleDialog } from "@/components/visit-schedule-dialog";
import {
  Bed,
  Bath,
  Square,
  Car,
  MapPin,
  Calendar,
  Eye,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Wifi,
  Dumbbell,
  Trees,
  Shield,
  Home as HomeIcon,
  Building2,
  Landmark,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    status: string;
    address: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    garage: boolean;
    pool?: boolean;
    balcony?: boolean;
    images?: string[] | null;
    createdAt: Date;
    agent?: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
  };
  userId?: string;
  className?: string;
}

export function EnhancedPropertyCard({
  property,
  userId,
  className,
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVisitDialog, setShowVisitDialog] = useState(false);

  const images = Array.isArray(property.images) ? property.images : [];
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FOR_SALE":
      case "AVAILABLE":
        return "bg-green-500";
      case "FOR_RENT":
        return "bg-blue-500";
      case "SOLD":
        return "bg-red-500";
      case "RENTED":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "FOR_SALE":
      case "AVAILABLE":
        return "À Venda";
      case "FOR_RENT":
        return "Para Alugar";
      case "SOLD":
        return "Vendido";
      case "RENTED":
        return "Alugado";
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "house":
      case "casa":
        return HomeIcon;
      case "apartment":
      case "apartamento":
        return Building2;
      case "land":
      case "terreno":
        return Trees;
      case "commercial":
      case "comercial":
        return Store;
      default:
        return HomeIcon;
    }
  };

  const TypeIcon = getTypeIcon(property.type);

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${formatPrice(property.price)}. Código: ${property.id}`;
    const whatsappUrl = `https://wa.me/5562985563905?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/imoveis/${property.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${formatPrice(property.price)}`,
          url: url,
        });
      } catch (error) {
        // Se a API nativa falhar, copiar para área de transferência
        navigator.clipboard.writeText(url);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "group hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2 border-border/50",
          className,
        )}
      >
        {/* Imagem */}
        <div className="relative h-52 overflow-hidden">
          {hasImages && currentImage && !imageError ? (
            <Image
              src={currentImage}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted via-muted/80 to-muted/60 flex items-center justify-center">
              <div className="text-center">
                <TypeIcon className="h-16 w-16 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Imagem não disponível
                </p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <Badge
            className={cn(
              "absolute top-3 left-3 text-white border-0 shadow-lg",
              getStatusColor(property.status),
            )}
          >
            {getStatusText(property.status)}
          </Badge>

          {/* Type Badge */}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-background/90 text-foreground border border-border/50 shadow-lg"
          >
            <TypeIcon className="h-3 w-3 mr-1" />
            {property.type}
          </Badge>

          {/* Navegação de imagens */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/60 hover:bg-white/80",
                  )}
                />
              ))}
            </div>
          )}

          {/* Ações rápidas */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="flex flex-col space-y-2">
              <AddToFavoritesButton
                propertyData={{
                  id: property.id,
                  titulo: property.title,
                  preco: property.price,
                  tipo: property.type,
                  quartos: property.bedrooms,
                  area: property.area,
                  localizacao: `${property.city}, ${property.state}`,
                  imageUrl: currentImage || "",
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-background/90 hover:bg-background shadow-lg"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Preço */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </p>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Código</p>
              <p className="text-sm font-mono text-foreground">
                {property.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Título */}
          <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Localização */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
            <span className="truncate">
              {property.address}, {property.city} - {property.state}
            </span>
          </div>

          {/* Características principais */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex items-center justify-center p-2 bg-muted/50 rounded-lg">
              <Bed className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-muted/50 rounded-lg">
              <Bath className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-muted/50 rounded-lg">
              <Square className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">{property.area}m²</span>
            </div>
          </div>

          {/* Comodidades */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.garage && (
              <Badge variant="outline" className="text-xs">
                <Car className="h-3 w-3 mr-1" />
                Garagem
              </Badge>
            )}
            {property.pool && (
              <Badge variant="outline" className="text-xs">
                <Dumbbell className="h-3 w-3 mr-1" />
                Piscina
              </Badge>
            )}
            {property.balcony && (
              <Badge variant="outline" className="text-xs">
                <Trees className="h-3 w-3 mr-1" />
                Varanda
              </Badge>
            )}
          </div>

          {/* Descrição */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {property.description}
          </p>

          {/* Informações do corretor */}
          {property.agent && (
            <div className="flex items-center text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-lg">
              {property.agent.image ? (
                <Image
                  src={property.agent.image}
                  alt={property.agent.name || "Corretor"}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                  sizes="24px"
                />
              ) : (
                <div className="w-6 h-6 bg-primary/20 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {property.agent.name?.charAt(0) || "C"}
                  </span>
                </div>
              )}
              <span>Corretor: {property.agent.name}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0 flex flex-col space-y-3">
          {/* Botões de ação principais */}
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
              onClick={() => setShowVisitDialog(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Visita
            </Button>
          </div>

          {/* Botões de contato */}
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`tel:5562985563905`, "_self")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Ligar
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Modal de agendamento de visita */}
      <VisitScheduleDialog
        isOpen={showVisitDialog}
        onClose={() => setShowVisitDialog(false)}
        property={property}
      />
    </>
  );
}

export default EnhancedPropertyCard;
