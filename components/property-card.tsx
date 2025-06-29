import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Ruler,
  Heart,
  Eye,
  Share2
} from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    address: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    parking?: number;
    type: string;
    status: string;
    images: { url: string }[];
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-green-500 text-white">Disponível</Badge>;
      case 'SOLD':
        return <Badge className="bg-red-500 text-white">Vendido</Badge>;
      case 'RENTED':
        return <Badge className="bg-blue-500 text-white">Alugado</Badge>;
      case 'RESERVED':
        return <Badge className="bg-yellow-500 text-white">Reservado</Badge>;
      default:
        return <Badge>Disponível</Badge>;
    }
  };

  return (
    <Card className="property-card group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={property.images[0]?.url || "/placeholder-property.svg"}
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-property.svg";
          }}
        />
        <div className="absolute top-4 left-4">
          {getStatusBadge(property.status)}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="sm" variant="secondary" className="p-2 bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="p-2 bg-white/90 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-2 text-foreground">
            {property.title}
          </h3>
          <span className="text-xl font-bold text-primary whitespace-nowrap">
            {formatCurrency(property.price)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.address}, {property.city}/{property.state}
          </span>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="grid grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{property.parking || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{property.area}m²</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4">
        <Link href={`/imoveis/${property.id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}