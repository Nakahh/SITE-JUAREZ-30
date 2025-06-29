
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  Users, 
  Award, 
  Heart, 
  Target, 
  Eye, 
  Star,
  Trophy,
  Calendar,
  MapPin,
  Phone,
  Mail,
  LinkedinIcon as LinkedIn
} from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { InstagramIcon } from "@/components/instagram-icon"
import Link from "next/link"

const teamMembers = [
  {
    name: "Juarez Siqueira",
    role: "Diretor Geral",
    bio: "Mais de 15 anos de experiência no mercado imobiliário. Especialista em negociações e desenvolvimento de relacionamentos duradouros.",
    image: "/placeholder-user.jpg",
    specialties: ["Gestão", "Negociação", "Relacionamento"]
  },
  {
    name: "Maria Campos", 
    role: "Gerente Comercial",
    bio: "Especialista em vendas de imóveis residenciais e comerciais. Foco em atendimento personalizado e satisfação do cliente.",
    image: "/placeholder-user.jpg",
    specialties: ["Vendas", "Atendimento", "Consultoria"]
  },
  {
    name: "Carlos Silva",
    role: "Corretor Senior",
    bio: "Corretor experiente com amplo conhecimento do mercado local. Especializado em imóveis de alto padrão.",
    image: "/placeholder-user.jpg", 
    specialties: ["Alto Padrão", "Avaliação", "Mercado Local"]
  },
  {
    name: "Ana Santos",
    role: "Corretora Especialista",
    bio: "Focada em primeiro imóvel e financiamentos. Dedicada a tornar o sonho da casa própria uma realidade.",
    image: "/placeholder-user.jpg",
    specialties: ["Primeiro Imóvel", "Financiamento", "Consultoria"]
  }
]

const achievements = [
  {
    icon: Building2,
    title: "500+",
    description: "Imóveis Vendidos",
    color: "text-blue-600"
  },
  {
    icon: Users,
    title: "15+",
    description: "Anos de Experiência", 
    color: "text-green-600"
  },
  {
    icon: Award,
    title: "98%",
    description: "Clientes Satisfeitos",
    color: "text-purple-600"
  },
  {
    icon: Heart,
    title: "1000+",
    description: "Famílias Atendidas",
    color: "text-red-600"
  }
]

const values = [
  {
    icon: Target,
    title: "Transparência",
    description: "Trabalhamos com total transparência em todas as negociações, fornecendo informações claras e precisas."
  },
  {
    icon: Heart,
    title: "Compromisso",
    description: "Nosso compromisso é com a realização dos sonhos dos nossos clientes, oferecendo o melhor atendimento."
  },
  {
    icon: Star,
    title: "Excelência",
    description: "Buscamos sempre a excelência em nossos serviços, superando expectativas e criando experiências únicas."
  },
  {
    icon: Users,
    title: "Relacionamento",
    description: "Construímos relacionamentos duradouros baseados na confiança, respeito e profissionalismo."
  }
]

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('/hero-bg.svg')] opacity-10"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sobre a
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Siqueira Campos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Conectando pessoas aos seus sonhos há mais de 15 anos
            </p>
            <div className="flex justify-center space-x-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <achievement.icon className={`h-8 w-8 mx-auto mb-2 ${achievement.color}`} />
                  <div className="text-2xl font-bold">{achievement.title}</div>
                  <div className="text-sm text-gray-300">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Nossa História</h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    A <strong>Siqueira Campos Imóveis</strong> nasceu em 2008 com um sonho simples: ajudar pessoas a encontrar 
                    o lar perfeito. Fundada por Juarez Siqueira, a empresa começou como uma pequena corretora 
                    no centro de Goiânia.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Ao longo dos anos, construímos uma reputação sólida baseada em <strong>transparência</strong>, 
                    <strong>confiança</strong> e <strong>resultados excepcionais</strong>. Hoje, somos uma das principais 
                    imobiliárias da região, com uma equipe especializada e portfólio diversificado.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Nossa jornada é marcada por histórias de sucesso, famílias realizadas e relacionamentos 
                    que transcendem negócios. Cada imóvel vendido representa um sonho conquistado, 
                    e isso nos motiva a continuar evoluindo.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                      <Card key={index} className="text-center">
                        <CardContent className="p-6">
                          <achievement.icon className={`h-12 w-12 mx-auto mb-3 ${achievement.color}`} />
                          <div className="text-3xl font-bold mb-1">{achievement.title}</div>
                          <div className="text-sm text-muted-foreground">{achievement.description}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Nossos Pilares</h2>
              <p className="text-lg text-muted-foreground">
                Os valores que nos guiam em cada negociação
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <Target className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                  <CardTitle className="text-2xl">Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Facilitar a realização de sonhos através de soluções imobiliárias inovadoras, 
                    oferecendo atendimento personalizado e criando valor para clientes, parceiros e comunidade.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <Eye className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                  <CardTitle className="text-2xl">Visão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ser referência no mercado imobiliário de Goiânia e região, reconhecida pela excelência 
                    no atendimento, inovação tecnológica e transformação positiva na vida das pessoas.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <Star className="h-16 w-16 mx-auto mb-4 text-green-600" />
                  <CardTitle className="text-2xl">Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>• Transparência total</p>
                    <p>• Compromisso com resultados</p>
                    <p>• Respeito ao cliente</p>
                    <p>• Inovação constante</p>
                    <p>• Responsabilidade social</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Valores Detalhados */}
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-full">
                        <value.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Nossa Equipe</h2>
              <p className="text-lg text-muted-foreground">
                Profissionais especializados e apaixonados pelo que fazem
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="relative mb-6">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={120}
                        height={120}
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prêmios e Reconhecimentos */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Prêmios e Reconhecimentos</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Nossa excelência reconhecida pelo mercado e clientes
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
                  <h3 className="text-xl font-semibold mb-2">Top Imobiliária 2023</h3>
                  <p className="text-muted-foreground">Prêmio de Melhor Imobiliária de Goiânia pelo CRECI-GO</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Star className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-semibold mb-2">Excelência em Atendimento</h3>
                  <p className="text-muted-foreground">Certificação de Qualidade em Atendimento ao Cliente</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Users className="h-16 w-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">Líder em Vendas</h3>
                  <p className="text-muted-foreground">Maior volume de vendas em Goiânia nos últimos 3 anos</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Responsabilidade Social */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Responsabilidade Social</h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Acreditamos que nosso sucesso está diretamente ligado ao desenvolvimento da nossa comunidade. 
                    Por isso, desenvolvemos diversos projetos sociais que impactam positivamente a vida das pessoas.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Heart className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">Projeto Casa dos Sonhos</h4>
                        <p>Facilitamos o acesso à casa própria para famílias de baixa renda através de parcerias especiais.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Users className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">Capacitação Profissional</h4>
                        <p>Oferecemos cursos gratuitos de capacitação em vendas e negociação para jovens da comunidade.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Building2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">Revitalização Urbana</h4>
                        <p>Participamos ativamente de projetos de revitalização de bairros e espaços públicos.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
                <div className="text-center">
                  <Heart className="h-24 w-24 mx-auto mb-6 text-red-500" />
                  <h3 className="text-2xl font-bold mb-4">Impacto Social</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">200+</div>
                      <div className="text-sm text-muted-foreground">Famílias Beneficiadas</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">50+</div>
                      <div className="text-sm text-muted-foreground">Jovens Capacitados</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">10+</div>
                      <div className="text-sm text-muted-foreground">Projetos Sociais</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-red-600">5</div>
                      <div className="text-sm text-muted-foreground">Anos de Atuação</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se aos milhares de clientes que já realizaram seus sonhos conosco
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <a href={`https://wa.me/5562985563905`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="mr-2 h-5 w-5" />
                Fale Conosco
              </a>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/imoveis">
                Ver Imóveis
              </Link>
            </Button>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <a 
              href={`https://wa.me/5562985563905`}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com/imoveissiqueiracampos"
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
