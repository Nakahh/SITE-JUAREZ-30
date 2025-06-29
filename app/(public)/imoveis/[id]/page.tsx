
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PropertyCard } from "@/components/property-card";
import { ScheduleVisitForm } from "@/components/schedule-visit-form";
import { PropertyReviewForm } from "@/components/property-review-form";
import { PropertyReviewsList } from "@/components/property-reviews-list";
import { AddToFavoritesButton } from "@/components/add-to-favorites-button";
import { AddToCompareButton } from "@/components/add-to-compare-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Ruler, 
  Calendar,
  Share2,
  Heart,
  Phone,
  MessageCircle,
  Home,
  Building,
  TreePine
} from "lucide-react";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      agent: true,
      reviews: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      visits: {
        where: {
          status: 'SCHEDULED'
        }
      }
    }
  });

  if (!property) {
    notFound();
  }

  const relatedProperties = await prisma.property.findMany({
    where: {
      AND: [
        { id: { not: property.id } },
        { city: property.city },
        { status: 'AVAILABLE' }
      ]
    },
    take: 3,
    include: {
      images: true
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      AVAILABLE: { text: 'Disponível', variant: 'default' as const },
      SOLD: { text: 'Vendido', variant: 'destructive' as const },
      RENTED: { text: 'Alugado', variant: 'secondary' as const },
      RESERVED: { text: 'Reservado', variant: 'outline' as const }
    };
    
    return variants[status as keyof typeof variants] || variants.AVAILABLE;
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'casa':
        return <Home className="h-4 w-4" />;
      case 'apartamento':
        return <Building className="h-4 w-4" />;
      case 'terreno':
        return <TreePine className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const statusInfo = getStatusBadge(property.status);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(property.type)}
              <span className="text-sm text-muted-foreground">{property.type}</span>
              <Badge variant={statusInfo.variant}>
                {statusInfo.text}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{property.address}, {property.neighborhood} - {property.city}/{property.state}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AddToFavoritesButton 
              propertyId={property.id} 
              userId={session?.user?.id} 
            />
            <AddToCompareButton propertyId={property.id} />
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse"></div>
          <img 
            src="/imoveis/casa-alto-padrao-hero.jpg"
            alt="Imóvel de Alto Padrão"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-property.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Imóveis de Alto Padrão</h2>
            <p className="text-sm opacity-90">Encontre o imóvel dos seus sonhos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={property.images[0]?.url || "/placeholder-property.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {property.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={image.url}
                        alt={`${property.title} - ${index + 2}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="location">Localização</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                <TabsTrigger value="virtual-tour">Tour Virtual</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Características</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Quartos</p>
                          <p className="font-semibold">{property.bedrooms}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Banheiros</p>
                          <p className="font-semibold">{property.bathrooms}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Garagem</p>
                          <p className="font-semibold">{property.parking || 0}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Área</p>
                          <p className="font-semibold">{property.area}m²</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>

                {property.amenities && property.amenities.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Comodidades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="location">
                <Card>
                  <CardHeader>
                    <CardTitle>Localização</CardTitle>
                    <CardDescription>
                      {property.address}, {property.neighborhood} - {property.city}/{property.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Mapa será carregado aqui</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="space-y-6">
                  {session && (
                    <PropertyReviewForm 
                      propertyId={property.id}
                      userId={session.user?.id!}
                    />
                  )}
                  <PropertyReviewsList reviews={property.reviews} />
                </div>
              </TabsContent>
              
              <TabsContent value="virtual-tour">
                <Card>
                  <CardHeader>
                    <CardTitle>Tour Virtual</CardTitle>
                    <CardDescription>
                      Explore o imóvel em 360°
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Tour virtual será carregado aqui</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  {formatCurrency(property.price)}
                </CardTitle>
                <CardDescription>
                  {property.saleType === 'SALE' ? 'Venda' : 'Aluguel'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">IPTU</p>
                    <p className="font-semibold">
                      {property.iptu ? formatCurrency(property.iptu) : 'Incluso'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Condomínio</p>
                    <p className="font-semibold">
                      {property.condominiumFee ? formatCurrency(property.condominiumFee) : 'Não há'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar Agora
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent Card */}
            {property.agent && (
              <Card>
                <CardHeader>
                  <CardTitle>Corretor Responsável</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <img 
                      src={property.agent.image || "/placeholder-user.svg"}
                      alt={property.agent.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{property.agent.name}</p>
                      <p className="text-sm text-muted-foreground">{property.agent.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Schedule Visit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agendar Visita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScheduleVisitForm 
                  propertyId={property.id}
                  userId={session?.user?.id}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Imóveis Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard key={relatedProperty.id} property={relatedProperty} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
