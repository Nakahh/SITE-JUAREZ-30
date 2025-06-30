import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EnhancedPropertyCard } from "@/components/enhanced-property-card";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  ArrowRight,
  Home,
  Building,
  Trees,
  Calculator,
  Users,
  Award,
  Shield,
  Clock,
  TrendingUp,
  Heart,
  Search,
  Filter,
} from "lucide-react";

export default function HomePage() {
  const featuredProperties = [
    {
      id: "1",
      title: "Casa Moderna Alto Padrão",
      description:
        "Casa de luxo com 4 quartos, piscina e área gourmet completa. Projeto moderno com acabamentos de primeira qualidade.",
      price: 850000,
      type: "HOUSE",
      status: "FOR_SALE",
      address: "Rua das Flores, 123",
      city: "Goiânia",
      state: "GO",
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      garage: true,
      pool: true,
      balcony: false,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      ],
      createdAt: new Date(),
      agent: {
        id: "agent1",
        name: "João Silva",
        image: null,
      },
    },
    {
      id: "2",
      title: "Apartamento Residencial Completo",
      description:
        "Apartamento moderno com 2 quartos e área de lazer completa. Localização privilegiada no centro da cidade.",
      price: 320000,
      type: "APARTMENT",
      status: "FOR_SALE",
      address: "Avenida Central, 456",
      city: "Goiânia",
      state: "GO",
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      garage: true,
      pool: false,
      balcony: true,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      ],
      createdAt: new Date(),
      agent: {
        id: "agent2",
        name: "Maria Santos",
        image: null,
      },
    },
    {
      id: "3",
      title: "Terreno Comercial Premium",
      description:
        "Terreno em localização privilegiada para investimento comercial. Área plana e com excelente potencial.",
      price: 180000,
      type: "LAND",
      status: "FOR_SALE",
      address: "Avenida Principal, 789",
      city: "Goiânia",
      state: "GO",
      bedrooms: 0,
      bathrooms: 0,
      area: 500,
      garage: false,
      pool: false,
      balcony: false,
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
      ],
      createdAt: new Date(),
      agent: {
        id: "agent3",
        name: "Carlos Oliveira",
        image: null,
      },
    },
  ];

  const stats = [
    { number: "500+", label: "Imóveis Vendidos", icon: Home },
    { number: "15+", label: "Anos de Experiência", icon: Award },
    { number: "1000+", label: "Clientes Satisfeitos", icon: Users },
    { number: "98%", label: "Taxa de Satisfação", icon: Star },
  ];

  const services = [
    {
      icon: Home,
      title: "Venda de Imóveis",
      description:
        "Encontre o imóvel dos seus sonhos com nossa expertise em vendas",
    },
    {
      icon: Building,
      title: "Locação",
      description: "Imóveis para aluguel com as melhores condições do mercado",
    },
    {
      icon: Calculator,
      title: "Financiamento",
      description: "Facilitamos seu financiamento com os melhores bancos",
    },
    {
      icon: Shield,
      title: "Consultoria Jurídica",
      description: "Segurança total em toda documentação e processo",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop"
            alt="Casa moderna de luxo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 container text-center text-white space-y-8 px-4">
          <div className="space-y-4">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 text-sm">
              🏆 Melhor Imobiliária de Siqueira Campos
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Encontre Seu
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Imóvel dos Sonhos
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Na Siqueira Campos Imóveis, transformamos sonhos em realidade há
              mais de 15 anos. Encontre o imóvel perfeito com nossa expertise e
              atendimento personalizado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-4 text-lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Explorar Imóveis
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Simular Financiamento
            </Button>
          </div>

          {/* Quick Search */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-4xl mx-auto border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Input
                  list="locations"
                  placeholder="Localização"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <datalist id="locations">
                  <option value="Centro, Goiânia" />
                  <option value="Setor Oeste, Goiânia" />
                  <option value="Jardim Goiás, Goiânia" />
                  <option value="Setor Bueno, Goiânia" />
                  <option value="Aparecida de Goiânia" />
                  <option value="Senador Canedo" />
                </datalist>
              </div>
              <div className="relative">
                <Input
                  list="property-types"
                  placeholder="Tipo de imóvel"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <datalist id="property-types">
                  <option value="Casa" />
                  <option value="Apartamento" />
                  <option value="Terreno" />
                  <option value="Comercial" />
                  <option value="Chácara" />
                </datalist>
              </div>
              <div className="relative">
                <Input
                  list="price-ranges"
                  placeholder="Preço máximo"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <datalist id="price-ranges">
                  <option value="R$ 100.000" />
                  <option value="R$ 200.000" />
                  <option value="R$ 300.000" />
                  <option value="R$ 500.000" />
                  <option value="R$ 800.000" />
                  <option value="R$ 1.000.000" />
                </datalist>
              </div>
              <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
        <div
          className="absolute bottom-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-primary border-primary">
              Destaques
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Imóveis em Destaque
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Selecionamos os melhores imóveis para você. Cada propriedade é
              cuidadosamente avaliada para garantir qualidade e valor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <EnhancedPropertyCard
                key={property.id}
                property={property}
                className="animate-fadeInUp"
              />
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/imoveis">
                Ver Todos os Imóveis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-primary border-primary">
              Nossos Serviços
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Como Podemos Ajudar Você
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Oferecemos serviços completos para tornar sua experiência
              imobiliária única e segura.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                    <service.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para Encontrar Seu Novo Lar?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Nossa equipe de especialistas está pronta para ajudá-lo a
              encontrar o imóvel perfeito. Entre em contato conosco hoje mesmo!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 px-8 py-4"
            >
              <Phone className="mr-2 h-5 w-5" />
              (62) 98556-3905
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-4"
            >
              <Mail className="mr-2 h-5 w-5" />
              Enviar Mensagem
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
