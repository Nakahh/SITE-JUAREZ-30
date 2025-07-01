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
import { Suspense } from "react";

// Componente de loading para seções
function SectionLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

// Componente assíncrono para propriedades em destaque
async function FeaturedProperties() {
  try {
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

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {featuredProperties.length > 0
          ? featuredProperties.map((property) => (
              <EnhancedPropertyCard key={property.id} property={property} />
            ))
          : // Fallback com dados mock se não houver propriedades
            [1, 2, 3].map((i) => (
              <Card
                key={i}
                className="overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src="/placeholder-property.svg"
                    alt={`Imóvel ${i}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    {i === 1 ? "Casa" : i === 2 ? "Apartamento" : "Terreno"}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {i === 1
                      ? "Casa 3 Quartos Centro"
                      : i === 2
                        ? "Apartamento 2 Quartos"
                        : "Terreno 500m²"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {i === 1
                      ? "Excelente casa com garagem"
                      : i === 2
                        ? "Apartamento moderno"
                        : "Terreno para construção"}
                  </p>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    Siqueira Campos, PR
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      R$ {i === 1 ? "450.000" : i === 2 ? "320.000" : "180.000"}
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar propriedades:", error);
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Erro ao carregar propriedades. Tente novamente mais tarde.
        </p>
      </div>
    );
  }
}

// Componente assíncrono para artigos do blog
async function RecentArticles() {
  try {
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

    return (
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {recentArticles.length > 0
          ? recentArticles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <div className="w-6 h-6 bg-muted rounded-full mr-2 flex items-center justify-center">
                      <Users className="h-3 w-3" />
                    </div>
                    {article.author.name}
                    <span className="mx-2">•</span>
                    {format(article.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                  <Link href={`/blog/${article.slug}`}>
                    <Button variant="outline" size="sm">
                      Ler Mais
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          : // Fallback com dados mock
            [1, 2, 3].map((i) => (
              <Card
                key={i}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {i === 1
                      ? "Como escolher seu primeiro imóvel"
                      : i === 2
                        ? "Dicas para financiamento imobiliário"
                        : "Mercado imobiliário em 2024"}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <div className="w-6 h-6 bg-muted rounded-full mr-2 flex items-center justify-center">
                      <Users className="h-3 w-3" />
                    </div>
                    Equipe Siqueira Campos
                    <span className="mx-2">•</span>
                    {new Date().toLocaleDateString("pt-BR")}
                  </div>
                  <Button variant="outline" size="sm">
                    Ler Mais
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Erro ao carregar artigos. Tente novamente mais tarde.
        </p>
      </div>
    );
  }
}

// Componente assíncrono para depoimentos
async function TestimonialsSection() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.length > 0
          ? testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.user.name}</div>
                    <div className="text-sm text-muted-foreground">Cliente</div>
                  </div>
                </div>
              </Card>
            ))
          : // Fallback com dados mock
            [
              {
                name: "Ana Costa",
                content:
                  "Excelente atendimento! Encontrei minha casa dos sonhos rapidamente.",
                rating: 5,
              },
              {
                name: "Carlos Silva",
                content:
                  "Profissionais muito competentes e prestativos. Recomendo!",
                rating: 5,
              },
              {
                name: "Maria Oliveira",
                content:
                  "Processo de compra foi muito tranquilo. Equipe nota 10!",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">Cliente</div>
                  </div>
                </div>
              </Card>
            ))}
      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar depoimentos:", error);
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Erro ao carregar depoimentos. Tente novamente mais tarde.
        </p>
      </div>
    );
  }
}

export default function HomePage() {
  const stats = [
    { number: "500+", label: "Imóveis Vendidos", icon: Home },
    { number: "1000+", label: "Clientes Satisfeitos", icon: Users },
    { number: "15+", label: "Anos de Experiência", icon: Award },
    { number: "98%", label: "Satisfação dos Clientes", icon: Star },
  ];

  const services = [
    {
      icon: Home,
      title: "Compra e Venda",
      description: "Assessoria completa para compra e venda de imóveis",
    },
    {
      icon: Building,
      title: "Locação",
      description: "Gestão completa de locações residenciais e comerciais",
    },
    {
      icon: Calculator,
      title: "Financiamento",
      description: "Consultoria em financiamentos e consórcios",
    },
    {
      icon: FileText,
      title: "Documentação",
      description: "Assessoria jurídica e documentação completa",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20">
                  🏆 #1 em Siqueira Campos
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Encontre seu{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    imóvel dos sonhos
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  A melhor imobiliária de Siqueira Campos e região. Conectamos
                  você ao lar perfeito com atendimento personalizado e
                  tecnologia de ponta.
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Cidade, bairro ou endereço..."
                      className="h-12"
                    />
                  </div>
                  <div>
                    <select className="w-full h-12 px-3 rounded-md border border-input bg-background">
                      <option>Tipo de imóvel</option>
                      <option>Casa</option>
                      <option>Apartamento</option>
                      <option>Terreno</option>
                    </select>
                  </div>
                  <Link href="/imoveis">
                    <Button size="lg" className="h-12 w-full">
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Imóveis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Anos</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"></div>
              <Image
                src="/hero-bg.svg"
                alt="Imóveis em destaque"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Selecionamos os melhores imóveis para você
            </p>
          </div>

          <Suspense fallback={<SectionLoading />}>
            <FeaturedProperties />
          </Suspense>

          <div className="text-center">
            <Link href="/imoveis">
              <Button size="lg">
                Ver Todos os Imóveis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Nossos Números
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Resultados que comprovam nossa excelência
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soluções completas para todas as suas necessidades imobiliárias
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de quem confia em nosso trabalho
            </p>
          </div>

          <Suspense fallback={<SectionLoading />}>
            <TestimonialsSection />
          </Suspense>

          <div className="text-center mt-12">
            <Link href="/depoimentos">
              <Button variant="outline" size="lg">
                Ver Mais Depoimentos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Blog e Notícias
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fique por dentro das novidades do mercado imobiliário
            </p>
          </div>

          <Suspense fallback={<SectionLoading />}>
            <RecentArticles />
          </Suspense>

          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" variant="outline">
                Ver Todos os Artigos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Pronto para encontrar seu novo lar?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Nossa equipe está pronta para ajudar você a realizar o sonho da casa
            própria
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contato">
              <Button size="lg" variant="secondary">
                <Phone className="h-4 w-4 mr-2" />
                Falar com Corretor
              </Button>
            </Link>
            <Link href="/contato">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar Mensagem
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
