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
  FileText,
  Calendar,
  Eye,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function HomePage() {
  // Buscar propriedades em destaque
  const featuredProperties = await prisma.property.findMany({
    where: {
      featured: true,
    },
    include: {
      agent: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Buscar artigos recentes do blog
  const recentArticles = await prisma.article.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

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
                property={{
                  id: property.id,
                  title: property.title,
                  description: property.description,
                  price: property.price,
                  type: property.type,
                  status: property.status,
                  address: property.address,
                  city: property.city,
                  state: property.state,
                  bedrooms: property.bedrooms,
                  bathrooms: property.bathrooms,
                  area: property.area,
                  garage: property.garage,
                  pool: property.pool,
                  balcony: property.balcony,
                  images: Array.isArray(property.images) ? property.images : [],
                  createdAt: property.createdAt,
                  agent: property.agent,
                }}
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

      {/* Blog Section */}
      <section className="py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-primary border-primary">
              Blog
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Últimas do Blog</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fique por dentro das novidades do mercado imobiliário, dicas de
              investimento e muito mais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      Artigo
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(article.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg leading-tight">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {article.content.substring(0, 150)}...
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {article.author?.name?.charAt(0) || "A"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {article.author?.name}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${article.slug}`}>
                        Ler mais
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {recentArticles.length > 0 && (
            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog">
                  Ver Todos os Artigos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Veja os depoimentos de quem já encontrou seu imóvel dos sonhos
              conosco
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {testimonial.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {testimonial.user?.name || "Cliente"}
                      </p>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {testimonials.length === 0 && (
            <div className="text-center text-muted-foreground">
              <p>Carregando depoimentos...</p>
            </div>
          )}
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
