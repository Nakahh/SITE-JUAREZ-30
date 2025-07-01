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

// Homepage rápida e simples sem consultas ao banco
export default function SimpleHomePage() {
  // Dados mock para demonstração
  const mockProperties = [
    {
      id: "1",
      title: "Casa 3 Quartos no Centro",
      description: "Excelente casa com 3 quartos, 2 banheiros e garagem",
      price: 450000,
      type: "HOUSE",
      address: "Rua das Flores, 123 - Centro",
      city: "Siqueira Campos",
      state: "PR",
      images: ["/placeholder-property.svg"],
      agent: { name: "João Silva", email: "joao@siqueiracampos.com" },
    },
    {
      id: "2",
      title: "Apartamento 2 Quartos",
      description: "Apartamento moderno com vista para a cidade",
      price: 320000,
      type: "APARTMENT",
      address: "Av. Principal, 456 - Bueno",
      city: "Siqueira Campos",
      state: "PR",
      images: ["/placeholder-property.svg"],
      agent: { name: "Maria Santos", email: "maria@siqueiracampos.com" },
    },
  ];

  const mockArticles = [
    {
      id: "1",
      title: "Como escolher seu primeiro imóvel",
      slug: "como-escolher-primeiro-imovel",
      createdAt: new Date(),
      author: { name: "João Silva", image: "/placeholder-user.svg" },
    },
    {
      id: "2",
      title: "Dicas para financiamento imobiliário",
      slug: "dicas-financiamento-imobiliario",
      createdAt: new Date(),
      author: { name: "Maria Santos", image: "/placeholder-user.svg" },
    },
  ];

  const mockTestimonials = [
    {
      id: "1",
      content:
        "Excelente atendimento! Encontrei minha casa dos sonhos rapidamente.",
      rating: 5,
      user: { name: "Ana Costa", image: "/placeholder-user.svg" },
    },
    {
      id: "2",
      content: "Profissionais muito competentes e prestativos. Recomendo!",
      rating: 5,
      user: { name: "Carlos Silva", image: "/placeholder-user.svg" },
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
                  <Button size="lg" className="h-12">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mockProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    {property.type === "HOUSE" ? "Casa" : "Apartamento"}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {property.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {property.description}
                  </p>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(property.price)}
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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

      {/* Services */}
      <section className="py-20 bg-muted/30">
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
            {[
              {
                icon: Home,
                title: "Compra e Venda",
                description:
                  "Assessoria completa para compra e venda de imóveis",
              },
              {
                icon: Building,
                title: "Locação",
                description:
                  "Gestão completa de locações residenciais e comerciais",
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
            ].map((service, index) => (
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
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de quem confia em nosso trabalho
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
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
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Blog e Notícias
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fique por dentro das novidades do mercado imobiliário
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {mockArticles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted"></div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <div className="w-6 h-6 bg-muted rounded-full mr-2"></div>
                    {article.author.name}
                    <span className="mx-2">•</span>
                    {new Date().toLocaleDateString("pt-BR")}
                  </div>
                  <Button variant="outline" size="sm">
                    Ler Mais
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

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
            <Button size="lg" variant="secondary">
              <Phone className="h-4 w-4 mr-2" />
              Falar com Corretor
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
