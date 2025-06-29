import Link from "next/link"
import { ArrowRight, MapPin, Phone, Star, TrendingUp, Users, Shield, Award, Search, Calculator, Heart, Calendar, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyCard } from "@/components/property-card"
import { NewsletterForm } from "@/components/newsletter-form"
import { FloatingChatBubble } from "@/components/floating-chat-bubble"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

async function getFeaturedProperties() {
  try {
    return await prisma.property.findMany({
      where: { status: "FOR_SALE" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        agent: {
          select: { name: true, email: true }
        }
      }
    })
  } catch {
    return []
  }
}

async function getRecentArticles() {
  try {
    return await prisma.article.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true }
        }
      }
    })
  } catch {
    return []
  }
}

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      take: 3,
      orderBy: { createdAt: "desc" }
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featuredProperties, recentArticles, testimonials] = await Promise.all([
    getFeaturedProperties(),
    getRecentArticles(),
    getTestimonials()
  ])

  const stats = [
    { icon: Users, label: "Clientes Satisfeitos", value: "500+" },
    { icon: Shield, label: "Anos de Experiência", value: "15+" },
    { icon: Award, label: "Imóveis Vendidos", value: "1000+" },
    { icon: TrendingUp, label: "Taxa de Sucesso", value: "98%" }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section com Background */}
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/hero-bg.svg')] opacity-10"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  🏆 Líderes em Goiânia
                </Badge>
                <h1 className="text-5xl font-bold leading-tight">
                  Encontre o 
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Imóvel dos Seus Sonhos
                  </span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Mais de 15 anos conectando pessoas aos melhores imóveis de Goiânia. 
                  Tecnologia, experiência e atendimento personalizado.
                </p>
              </div>

              {/* Quick Search */}
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select>
                      <SelectTrigger className="bg-white text-black">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input placeholder="Localização" className="bg-white text-black" />
                    <Input placeholder="Preço máximo" className="bg-white text-black" />

                    <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      <Link href="/imoveis">
                        <Search className="mr-2 h-4 w-4" />
                        Buscar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                  <Link href="/imoveis">
                    Ver Imóveis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary">
                  <Link href="/simulador-financiamento">
                    <Calculator className="mr-2 h-5 w-5" />
                    Simular Financiamento
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary">
                  <Link href="/contato">
                    <Phone className="mr-2 h-5 w-5" />
                    (62) 9 8556-3905
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/imoveis/luxury-property-hero.jpg"
                  alt="Imóvel de luxo"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  priority
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.9/5 Avaliação</span>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">🏠 Imóveis em Destaque</Badge>
            <h2 className="text-4xl font-bold mb-4">Propriedades Selecionadas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Confira nossa seleção especial de imóveis com as melhores localizações e preços de Goiânia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/imoveis">
                Ver Todos os Imóveis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">⚡ Nossos Serviços</Badge>
            <h2 className="text-4xl font-bold mb-4">Soluções Completas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos todos os serviços que você precisa para comprar, vender ou alugar seu imóvel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: "Busca Personalizada",
                description: "Encontramos o imóvel perfeito baseado no seu perfil",
                link: "/imoveis"
              },
              {
                icon: Calculator,
                title: "Simulador de Financiamento",
                description: "Calcule prestações e condições de pagamento",
                link: "/simulador-financiamento"
              },
              {
                icon: Calendar,
                title: "Agendamento Online",
                description: "Agende visitas de forma rápida e prática",
                link: "/imoveis"
              },
              {
                icon: MessageCircle,
                title: "Suporte 24/7",
                description: "Atendimento via chat, WhatsApp e telefone",
                link: "/contato"
              }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4">{service.description}</CardDescription>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={service.link}>Saiba Mais</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">💬 Depoimentos</Badge>
              <h2 className="text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A satisfação dos nossos clientes é nossa maior conquista
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg italic mb-4">
                      "{testimonial.content}"
                    </blockquote>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/depoimentos">Ver Todos os Depoimentos</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {recentArticles.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">📰 Blog</Badge>
              <h2 className="text-4xl font-bold mb-4">Últimas Notícias</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fique por dentro das tendências do mercado imobiliário
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">
                      {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                    </Badge>
                    <CardTitle className="line-clamp-2">
                      <Link href={`/blog/${article.slug}`} className="hover:text-primary">
                        {article.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {article.content.substring(0, 150)}...
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Por {article.author.name}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${article.slug}`}>
                          Ler Mais
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/blog">Ver Todos os Artigos</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">❓ FAQ</Badge>
            <h2 className="text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre compra, venda e financiamento de imóveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "Como funciona o processo de compra?",
                answer: "Nosso processo é simples: busca → visita → negociação → documentação → escritura. Te acompanhamos em cada etapa."
              },
              {
                question: "Vocês ajudam com financiamento?",
                answer: "Sim! Temos parcerias com os principais bancos e oferecemos simulação gratuita de financiamento."
              },
              {
                question: "Posso agendar visitas online?",
                answer: "Claro! Você pode agendar visitas diretamente pelo site ou WhatsApp de forma rápida e prática."
              },
              {
                question: "Qual a documentação necessária?",
                answer: "Depende do tipo de operação. Nossa equipe te orienta sobre todos os documentos necessários."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Fique Por Dentro</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Receba as melhores oportunidades de imóveis diretamente no seu email
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat */}
      <FloatingChatBubble />
    </div>
  )
}