import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/property-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { prisma } from "@/lib/prisma";
import { 
  Search, 
  MapPin, 
  Star, 
  TrendingUp, 
  Shield, 
  Users, 
  Award,
  ArrowRight,
  Home,
  Building,
  TreePine,
  Calculator,
  Heart,
  MessageCircle
} from "lucide-react";

export default async function HomePage() {
  const featuredProperties = await prisma.property.findMany({
    where: { status: 'AVAILABLE' },
    take: 6,
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  const recentArticles = await prisma.article.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  const stats = [
    { label: "Imóveis Vendidos", value: "500+", icon: Home },
    { label: "Clientes Satisfeitos", value: "1000+", icon: Users },
    { label: "Anos de Experiência", value: "15+", icon: Award },
    { label: "Corretores Especialistas", value: "25+", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/imoveis/luxury-property-hero.jpg"
            alt="Imóvel de Alto Padrão"
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-transparent to-amber-800/20 dark:from-amber-400/10 dark:to-amber-600/10"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">
              <Star className="h-4 w-4 mr-2" />
              Imobiliária de Confiança desde 2009
            </Badge>

            <h1 className="hero-title text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Encontre o{" "}
              <span className="text-amber-600 dark:text-amber-400">Imóvel Perfeito</span>{" "}
              para Você
            </h1>

            <p className="hero-subtitle text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Na Siqueira Campos Imóveis, transformamos sonhos em realidade. 
              Oferecemos as melhores oportunidades do mercado imobiliário com 
              transparência, qualidade e excelência no atendimento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/imoveis">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Buscar Imóveis
                </Button>
              </Link>

              <Link href="/contato">
                <Button variant="outline" size="lg" className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-900/20 px-8 py-3 text-lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-amber-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30 transition-colors">
                    <Icon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <TrendingUp className="h-4 w-4 mr-2" />
              Destaques
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Selecionamos as melhores oportunidades do mercado para você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/imoveis">
              <Button variant="outline" size="lg" className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-900/20">
                Ver Todos os Imóveis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Oferecemos soluções completas para todas as suas necessidades imobiliárias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-amber-200/50 dark:border-slate-700">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4 mx-auto group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30 transition-colors">
                  <Home className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-slate-800 dark:text-slate-200">Compra e Venda</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                  Facilitamos todo o processo de compra e venda do seu imóvel com segurança e transparência.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-amber-200/50 dark:border-slate-700">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4 mx-auto group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30 transition-colors">
                  <Building className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-slate-800 dark:text-slate-200">Locação</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                  Encontre o imóvel ideal para alugar ou coloque o seu para locação com nossa gestão completa.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-amber-200/50 dark:border-slate-700">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4 mx-auto group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30 transition-colors">
                  <Calculator className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-slate-800 dark:text-slate-200">Financiamento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                  Ajudamos você a conseguir o melhor financiamento para realizar o sonho da casa própria.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                O que nossos clientes dizem
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Depoimentos reais de quem confia em nosso trabalho
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-amber-200/50 dark:border-slate-700">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image || "/placeholder-user.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-slate-800 dark:text-slate-200">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-amber-600 dark:bg-amber-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Fique por dentro das novidades
          </h2>
          <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
            Receba em primeira mão os melhores imóveis e dicas do mercado imobiliário
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}