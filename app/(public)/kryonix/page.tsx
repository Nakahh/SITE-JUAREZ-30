
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Database, Globe, Smartphone, Zap, Shield, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function KryonixPage() {
  const servicos = [
    {
      icone: <Globe className="h-8 w-8" />,
      titulo: "Desenvolvimento Web",
      descricao: "Sites modernos e responsivos com tecnologias de ponta",
      tecnologias: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
    },
    {
      icone: <Smartphone className="h-8 w-8" />,
      titulo: "Aplicativos Mobile",
      descricao: "Apps nativos e híbridos para iOS e Android",
      tecnologias: ["React Native", "Flutter", "Swift", "Kotlin"]
    },
    {
      icone: <Database className="h-8 w-8" />,
      titulo: "Sistemas Corporativos",
      descricao: "ERPs, CRMs e plataformas de gestão customizadas",
      tecnologias: ["Node.js", "PostgreSQL", "MongoDB", "AWS"]
    },
    {
      icone: <Code className="h-8 w-8" />,
      titulo: "APIs e Integrações",
      descricao: "Desenvolvimento de APIs REST e integrações",
      tecnologias: ["GraphQL", "REST", "Microservices", "Docker"]
    },
    {
      icone: <Zap className="h-8 w-8" />,
      titulo: "Automação de Processos",
      descricao: "Bots, chatbots e automações inteligentes",
      tecnologias: ["AI/ML", "WhatsApp API", "Telegram", "OpenAI"]
    },
    {
      icone: <Shield className="h-8 w-8" />,
      titulo: "Segurança Digital",
      descricao: "Implementação de segurança e compliance",
      tecnologias: ["OAuth", "JWT", "SSL/TLS", "LGPD"]
    }
  ]

  const equipe = [
    {
      nome: "Ricardo Santos",
      cargo: "CEO & Founder",
      descricao: "Especialista em arquitetura de software e liderança técnica",
      foto: "/placeholder-user.jpg"
    },
    {
      nome: "Marina Silva",
      cargo: "CTO",
      descricao: "Desenvolvedora Full Stack com 8+ anos de experiência",
      foto: "/placeholder-user.jpg"
    },
    {
      nome: "Carlos Oliveira",
      cargo: "Lead Developer",
      descricao: "Expert em React, Node.js e DevOps",
      foto: "/placeholder-user.jpg"
    },
    {
      nome: "Ana Costa",
      cargo: "UI/UX Designer",
      descricao: "Designer focada em experiência do usuário e interfaces modernas",
      foto: "/placeholder-user.jpg"
    }
  ]

  const projetos = [
    {
      nome: "Siqueira Campos Imóveis",
      descricao: "Plataforma completa de gestão imobiliária com IA",
      tecnologias: ["Next.js", "PostgreSQL", "OpenAI", "Prisma"]
    },
    {
      nome: "Sistema Hospitalar",
      descricao: "ERP para gestão de clínicas e hospitais",
      tecnologias: ["React", "Node.js", "MongoDB", "WebSocket"]
    },
    {
      nome: "E-commerce Marketplace",
      descricao: "Plataforma de vendas online multi-vendor",
      tecnologias: ["Next.js", "Stripe", "Redis", "AWS"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-kryonix.png"
              alt="Kryonix Logo"
              width={120}
              height={120}
              className="rounded-full bg-white p-4"
            />
          </div>
          <h1 className="text-5xl font-bold mb-6">Kryonix</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Transformando ideias em soluções digitais inovadoras. 
            Especialistas em desenvolvimento de software personalizado para empresas visionárias.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Iniciar Projeto
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Conheça Nossos Serviços
            </Button>
          </div>
        </div>
      </section>

      {/* Sobre a Empresa */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sobre a Kryonix</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Fundada em 2019, a Kryonix é uma empresa brasileira especializada em desenvolvimento 
              de software personalizado. Nossa missão é democratizar a tecnologia, criando soluções 
              acessíveis e inovadoras que impulsionam o crescimento dos nossos clientes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>100+</CardTitle>
                <CardDescription>Projetos Entregues</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                <CardTitle>4.9/5</CardTitle>
                <CardDescription>Avaliação dos Clientes</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <CardTitle>5 Anos</CardTitle>
                <CardDescription>de Experiência</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-lg text-muted-foreground">
              Oferecemos soluções completas em tecnologia para impulsionar seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.map((servico, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="text-blue-600 mb-2">{servico.icone}</div>
                  <CardTitle className="text-xl">{servico.titulo}</CardTitle>
                  <CardDescription>{servico.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {servico.tecnologias.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-lg text-muted-foreground">
              Profissionais experientes e apaixonados por tecnologia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipe.map((membro, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={membro.foto}
                      alt={membro.nome}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{membro.nome}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {membro.cargo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{membro.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos em Destaque */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Projetos em Destaque</h2>
            <p className="text-lg text-muted-foreground">
              Alguns dos nossos trabalhos mais recentes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {projetos.map((projeto, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{projeto.nome}</CardTitle>
                  <CardDescription>{projeto.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {projeto.tecnologias.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Transformar Sua Ideia?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar seu negócio 
            a alcançar o próximo nível com tecnologia de ponta.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="https://wa.me/5517981805327" target="_blank">
                Falar no WhatsApp
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="https://instagram.com/kryon.ix" target="_blank">
                Seguir no Instagram
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
