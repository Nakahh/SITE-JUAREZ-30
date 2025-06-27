import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, BedSingle, Ruler } from "lucide-react";
import { AddToFavoritesButton } from "./add-to-favorites-button";
import { AddToCompareButton } from "./add-to-compare-button";

interface PropertyCardProps {
  id: string;
  titulo: string;
  preco: number;
  tipo: string;
  quartos: number;
  area: number;
  localizacao: string;
  imageUrls?: string[];
  comodidades?: string[];
}

const tipoImovelPortugues = (tipo: string) => {
  switch (tipo) {
    case "HOUSE":
      return "Casa";
    case "APARTMENT":
      return "Apartamento";
    case "COMMERCIAL":
      return "Comercial";
    case "LAND":
      return "Terreno";
    default:
      return tipo;
  }
};

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
  const displayImageUrl =
    imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/placeholder.svg";

  const propertyData = {
    id,
    titulo,
    preco,
    tipo,
    quartos,
    area,
    localizacao,
    imageUrl: displayImageUrl,
  };

  return (
    <Card className="w-full max-w-sm shadow-md card-hover fade-in group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={displayImageUrl}
            alt={titulo}
            width={300}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <AddToFavoritesButton propertyData={propertyData} />
            <AddToCompareButton propertyData={propertyData} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {titulo}
        </CardTitle>
        <p className="text-2xl font-bold text-primary mb-3">
          R$ {preco.toLocaleString("pt-BR")}
        </p>
        {comodidades && comodidades.length > 0 && (
          <div className="text-sm text-muted-foreground mb-3">
            {comodidades.slice(0, 3).join(", ")}
            {comodidades.length > 3 && "..."}
          </div>
        )}
        <div className="mt-2 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Home className="h-4 w-4 text-primary mr-1" />
            <span>{tipoImovelPortugues(tipo)}</span>
          </div>
          <div className="flex items-center">
            <BedSingle className="h-4 w-4 text-primary mr-1" />
            <span>{quartos} quartos</span>
          </div>
          <div className="flex items-center">
            <Ruler className="h-4 w-4 text-primary mr-1" />
            <span>{area}m²</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{localizacao}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild className="flex-1 ripple">
          <Link href={`/imoveis/${id}`}>Ver Detalhes</Link>
        </Button>
        <Button variant="outline" asChild className="flex-1 ripple">
          <Link href={`/contato?imovel=${id}`}>Contatar</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
