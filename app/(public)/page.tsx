import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import PropertyCard from "@/components/property-card"
import { 
  Home, 
  Users, 
  Award, 
  TrendingUp, 
  Search, 
  MapPin, 
  Phone, 
  Mail,
  Star,
  ArrowRight,
  Calculator,
  Heart
} from "lucide-react"

async function getRecentProperties() {
  return await prisma.property.findMany({
    where: { 
      status: 'AVAILABLE',
      featured: true 
    },
    take: 6,
    orderBy: { createdAt: 'desc' }
  })
}

async function getTestimonials() {
  return await prisma.testimonial.findMany({
    where: { approved: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })
}

export default async function HomePage() {
  const [properties, testimonials] = await Promise.all([
    getRecentProperties(),
    getTestimonials()
  ])

  const stats = [
    { icon: Home, label: "Imóveis Vendidos", value: "500+" },
    { icon: Users, label: "Clientes Satisfeitos", value: "1000+" },
    { icon: Award, label: "Anos de Experiência", value: "15+" },
    { icon: TrendingUp, label: "Taxa de Sucesso", value: "95%" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section com imagem de alto padrão */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/imoveis/luxury-property-hero.jpg"
            alt="Imóvel de alto padrão"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-primary/20 text-white border-primary/30 backdrop-blur-sm">
              Imóveis de Alto Padrão
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Encontre o
              <span className="block gradient-text bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Imóvel dos Seus Sonhos
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Mais de 15 anos conectando pessoas aos melhores imóveis da região. 
              Sua nova vida começa aqui.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
                <Link href="/imoveis">
                  <Search className="mr-2 h-5 w-5" />
                  Explorar Imóveis
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                <Link href="/simulador-financiamento">
                  <Calculator className="mr-2 h-5 w-5" />
                  Simular Financiamento
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Destaques</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Imóveis em Destaque</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selecionamos os melhores imóveis para você. Casas, apartamentos e terrenos únicos.
            </p>
          </div>

          {properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center">
                <Button asChild size="lg" variant="outline">
                  <Link href="/imoveis">
                    Ver Todos os Imóveis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum imóvel em destaque</h3>
              <p className="text-muted-foreground">Em breve novos imóveis serão adicionados.</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Nossos Serviços</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Podemos Ajudar</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos uma gama completa de serviços imobiliários para atender todas as suas necessidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Busca Personalizada",
                description: "Encontramos o imóvel perfeito baseado nos seus critérios específicos.",
                color: "text-blue-600"
              },
              {
                icon: Calculator,
                title: "Simulação de Financiamento",
                description: "Calcule as melhores condições de financiamento para seu imóvel.",
                color: "text-green-600"
              },
              {
                icon: MapPin,
                title: "Visitas Agendadas",
                description: "Agende visitas nos horários mais convenientes para você.",
                color: "text-purple-600"
              },
              {
                icon: Heart,
                title: "Consultoria Especializada",
                description: "Nossa equipe oferece consultoria completa em negócios imobiliários.",
                color: "text-red-600"
              },
              {
                icon: TrendingUp,
                title: "Avaliação de Imóveis",
                description: "Avaliamos seu imóvel com precisão para otimizar sua venda.",
                color: "text-yellow-600"
              },
              {
                icon: Award,
                title: "Pós-Venda",
                description: "Acompanhamento completo mesmo após a conclusão do negócio.",
                color: "text-indigo-600"
              }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${service.color}`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4">Depoimentos</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A satisfação dos nossos clientes é nossa maior conquista.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">Cliente</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Encontrar Seu Novo Lar?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Entre em contato conosco hoje mesmo e deixe nossos especialistas ajudá-lo a realizar o sonho da casa própria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                <Link href="/contato">
                  <Phone className="mr-2 h-5 w-5" />
                  Falar com Consultor
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/imoveis">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Imóveis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}