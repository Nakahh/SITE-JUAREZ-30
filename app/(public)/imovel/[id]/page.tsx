import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Dumbbell,
  Trees,
  ArrowLeft,
  Share,
  Heart,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      agent: {
        select: {
          name: true,
          email: true,
          whatsapp: true,
        },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const images = Array.isArray(property.images) ? property.images : [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="outline">
            <Link href="/imoveis">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Imóveis
            </Link>
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Imagens e Detalhes Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galeria de Imagens */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {hasImages && images[0] ? (
                <Image
                  src={images[0] as string}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Imagem não disponível</p>
                </div>
              )}

              {/* Status Badge */}
              <Badge
                className={`absolute top-4 left-4 text-white border-0 ${getStatusColor(property.status)}`}
              >
                {getStatusText(property.status)}
              </Badge>
            </div>

            {/* Detalhes do Imóvel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span>
                  {property.address}, {property.city} - {property.state}
                </span>
              </div>

              {/* Características */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">Quartos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">Banheiros</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.area}</p>
                    <p className="text-sm text-muted-foreground">m²</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Car className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">
                      {property.garage ? "1+" : "0"}
                    </p>
                    <p className="text-sm text-muted-foreground">Garagem</p>
                  </CardContent>
                </Card>
              </div>

              {/* Comodidades */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Comodidades</h3>
                <div className="flex flex-wrap gap-2">
                  {property.garage && (
                    <Badge variant="outline">
                      <Car className="h-3 w-3 mr-1" />
                      Garagem
                    </Badge>
                  )}
                  {property.pool && (
                    <Badge variant="outline">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      Piscina
                    </Badge>
                  )}
                  {property.balcony && (
                    <Badge variant="outline">
                      <Trees className="h-3 w-3 mr-1" />
                      Varanda
                    </Badge>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Informações de Contato */}
          <div className="space-y-6">
            {/* Corretor */}
            {property.agent && (
              <Card>
                <CardHeader>
                  <CardTitle>Corretor Responsável</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold">{property.agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {property.agent.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar Agora
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agendar Visita */}
            <Card>
              <CardHeader>
                <CardTitle>Agendar Visita</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Visita
                </Button>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="text-sm font-medium">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium">
                    {getStatusText(property.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Área:</span>
                  <span className="text-sm font-medium">{property.area}m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quartos:
                  </span>
                  <span className="text-sm font-medium">
                    {property.bedrooms}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Banheiros:
                  </span>
                  <span className="text-sm font-medium">
                    {property.bathrooms}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
