
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
  Share2,
  Home,
  Building,
  TreePine
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
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Disponível</Badge>;
      case 'SOLD':
        return <Badge className="bg-red-600 text-white hover:bg-red-700">Vendido</Badge>;
      case 'RENTED':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Alugado</Badge>;
      case 'RESERVED':
        return <Badge className="bg-amber-600 text-white hover:bg-amber-700">Reservado</Badge>;
      default:
        return <Badge className="bg-emerald-600 text-white">Disponível</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'casa':
        return <Home className="h-4 w-4 text-amber-600" />;
      case 'apartamento':
        return <Building className="h-4 w-4 text-amber-600" />;
      case 'terreno':
        return <TreePine className="h-4 w-4 text-amber-600" />;
      default:
        return <Home className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <Card className="property-card group overflow-hidden border border-amber-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-900 dark:border-slate-700">
      <div className="relative overflow-hidden">
        <img 
          src={property.images[0]?.url || "/imoveis/luxury-property-hero.jpg"}
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/imoveis/luxury-property-hero.jpg";
          }}
        />
        <div className="absolute top-3 left-3">
          {getStatusBadge(property.status)}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="sm" variant="secondary" className="p-2 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800">
            <Heart className="h-4 w-4 text-amber-600" />
          </Button>
          <Button size="sm" variant="secondary" className="p-2 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800">
            <Share2 className="h-4 w-4 text-amber-600" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-md">
          {getTypeIcon(property.type)}
          <span className="text-sm font-medium text-amber-800 dark:text-amber-400">{property.type}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pb-3 space-y-2">
        <div className="space-y-2">
          <h3 className="font-bold text-lg line-clamp-2 text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
            {property.title}
          </h3>
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-500">
            {formatCurrency(property.price)}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <MapPin className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span className="text-sm truncate">
            {property.address}, {property.city}/{property.state}
          </span>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-slate-800 p-2 rounded-lg">
            <Bed className="h-5 w-5 text-amber-600" />
            <div className="text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400">Quartos</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{property.bedrooms}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-slate-800 p-2 rounded-lg">
            <Bath className="h-5 w-5 text-amber-600" />
            <div className="text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400">Banheiros</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{property.bathrooms}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-slate-800 p-2 rounded-lg">
            <Car className="h-5 w-5 text-amber-600" />
            <div className="text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400">Garagem</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{property.parking || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-slate-800 p-2 rounded-lg">
            <Ruler className="h-5 w-5 text-amber-600" />
            <div className="text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400">Área</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{property.area}m²</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4">
        <Link href={`/imoveis/${property.id}`} className="w-full">
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
