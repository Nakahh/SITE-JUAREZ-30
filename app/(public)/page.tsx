
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Home, 
  Building, 
  MapPin, 
  Search, 
  Users, 
  Award, 
  TrendingUp, 
  Shield,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Calculator,
  Heart,
  Eye,
  Bed,
  Bath,
  Car,
  Maximize,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Clock,
  CheckCircle,
  PlayCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { InstagramIcon } from "@/components/instagram-icon"

export default function HomePage() {
  const whatsappNumber = "(62) 9 8765-4321"
  const email = "contato@siqueiracamposituba.com.br"

  const featuredProperties = [
    {
      id: 1,
      title: "Casa de Alto Padrão - Condomínio Fechado",
      location: "Alphaville, Goiânia",
      price: "R$ 850.000",
      beds: 4,
      baths: 3,
      garage: 2,
      area: "280m²",
      image: "/imoveis/casa-alto-padrao-hero.jpg",
      badge: "Destaque",
      type: "Venda"
    },
    {
      id: 2,
      title: "Apartamento Moderno no Setor Bueno",
      location: "Setor Bueno, Goiânia",
      price: "R$ 420.000",
      beds: 3,
      baths: 2,
      garage: 2,
      area: "95m²",
      image: "/imoveis/casa-condominio-1.jpg",
      badge: "Novo",
      type: "Venda"
    },
    {
      id: 3,
      title: "Cobertura Luxuosa com Vista Panorâmica",
      location: "Setor Marista, Goiânia",
      price: "R$ 1.200.000",
      beds: 4,
      baths: 4,
      garage: 3,
      area: "350m²",
      image: "/imoveis/luxury-property-hero.jpg",
      badge: "Premium",
      type: "Venda"
    }
  ]

  const services = [
    {
      icon: <Home className="h-8 w-8" />,
      title: "Compra e Venda",
      description: "Assessoria completa para compra e venda de imóveis com segurança e agilidade.",
      features: ["Avaliação gratuita", "Documentação completa", "Suporte jurídico"]
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Locação",
      description: "Encontre o imóvel ideal para alugar ou coloque o seu para locação.",
      features: ["Gestão completa", "Inquilinos qualificados", "Contratos seguros"]
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "Financiamento",
      description: "Simulação e assessoria para financiamento imobiliário com as melhores condições.",
      features: ["Simulação gratuita", "Melhores taxas", "Aprovação rápida"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Consultoria",
      description: "Consultoria especializada em investimentos imobiliários e oportunidades de negócio.",
      features: ["Análise de mercado", "ROI garantido", "Estratégias personalizadas"]
    }
  ]

  const stats = [
    { icon: <Building className="h-6 w-6" />, value: "1.500+", label: "Imóveis Vendidos" },
    { icon: <Users className="h-6 w-6" />, value: "3.000+", label: "Clientes Satisfeitos" },
    { icon: <Award className="h-6 w-6" />, value: "15+", label: "Anos de Experiência" },
    { icon: <TrendingUp className="h-6 w-6" />, value: "98%", label: "Taxa de Satisfação" }
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empresária",
      content: "Excelente atendimento! Encontrei minha casa dos sonhos em menos de um mês. Equipe muito profissional.",
      rating: 5,
      image: "/placeholder-user.jpg"
    },
    {
      name: "João Santos",
      role: "Investidor",
      content: "A Siqueira Campos me ajudou a montar um portfólio imobiliário rentável. Recomendo para investimentos.",
      rating: 5,
      image: "/placeholder-user.jpg"
    },
    {
      name: "Ana Costa",
      role: "Arquiteta",
      content: "Venderam meu apartamento pelo melhor preço do mercado. Processo transparente e rápido.",
      rating: 5,
      image: "/placeholder-user.jpg"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section Enhanced */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-section">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container relative z-10 px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                🏆 Melhor Imobiliária de Goiânia 2024
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Realize o Sonho da
                <span className="block text-accent">Casa Própria</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Há mais de 15 anos conectando pessoas aos seus lares ideais em Goiânia e região metropolitana.
              </p>
            </div>

            {/* Search Bar Enhanced */}
            <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/70">
                    <SelectValue placeholder="Tipo de Imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/70">
                    <SelectValue placeholder="Finalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="aluguel">Aluguel</SelectItem>
                  </SelectContent>
                </Select>

                <Input 
                  placeholder="Localização" 
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />

                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>

              <div className="flex items-center justify-center mt-4 space-x-4">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </Button>
                <Separator orientation="vertical" className="h-4 bg-white/30" />
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritos (0)
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg">
                <Building className="h-5 w-5 mr-2" />
                Ver Imóveis
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-semibold px-8 py-4 text-lg">
                <Calculator className="h-5 w-5 mr-2" />
                Simular Financiamento
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Properties Enhanced */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Destaques</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Imóveis em <span className="text-gradient">Destaque</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selecionamos os melhores imóveis com localização privilegiada e excelente custo-benefício.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property, index) => (
              <Card key={property.id} className="property-card group overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      {property.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm border-none hover:bg-white/30">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {property.type}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                    {property.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gradient">
                      {property.price}
                    </span>
                    <Button size="sm" variant="ghost" className="text-muted-foreground">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {property.beds}
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.baths}
                    </div>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-1" />
                      {property.garage}
                    </div>
                    <div className="flex items-center">
                      <Maximize className="h-4 w-4 mr-1" />
                      {property.area}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                      <Phone className="h-4 w-4 mr-2" />
                      Contatar
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild className="group">
              <Link href="/imoveis">
                Ver Todos os Imóveis
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section Enhanced */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Nossos Serviços</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Soluções <span className="text-gradient">Completas</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos um atendimento 360° para todas as suas necessidades imobiliárias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Enhanced */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Depoimentos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que nossos <span className="text-gradient">Clientes</span> dizem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A satisfação dos nossos clientes é nossa maior conquista.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Enhanced */}
      <section className="py-20 bg-gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para encontrar seu <span className="text-accent">próximo lar</span>?
            </h2>
            <p className="text-xl opacity-90">
              Nossa equipe especializada está pronta para te ajudar a realizar o sonho da casa própria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Phone className="h-5 w-5 mr-2" />
                Falar com Especialista
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <WhatsAppIcon className="h-5 w-5 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
