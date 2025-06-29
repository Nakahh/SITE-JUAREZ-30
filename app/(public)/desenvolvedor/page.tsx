
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { InstagramIcon } from '@/components/instagram-icon'
import { 
  Globe, 
  Smartphone, 
  Database, 
  Code, 
  Zap, 
  Shield, 
  Users, 
  Star, 
  Target,
  Briefcase,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const services = [
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Desenvolvimento Web",
    description: "Sites modernos e responsivos com tecnologias de ponta",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "Aplicativos Mobile",
    description: "Apps nativos e híbridos para iOS e Android",
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"]
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Sistemas Corporativos",
    description: "ERPs, CRMs e plataformas de gestão customizadas",
    technologies: ["Node.js", "PostgreSQL", "MongoDB", "AWS"]
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "APIs e Integrações",
    description: "Desenvolvimento de APIs REST e integrações",
    technologies: ["GraphQL", "REST", "Microservices", "Docker"]
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Automação de Processos",
    description: "Bots, chatbots e automações inteligentes",
    technologies: ["AI/ML", "WhatsApp API", "Telegram", "OpenAI"]
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Segurança Digital",
    description: "Implementação de segurança e compliance",
    technologies: ["OAuth", "JWT", "SSL/TLS", "LGPD"]
  }
]

const stats = [
  { icon: <Briefcase className="h-8 w-8" />, label: "Projetos Entregues", value: "150+" },
  { icon: <Users className="h-8 w-8" />, label: "Clientes Satisfeitos", value: "80+" },
  { icon: <Clock className="h-8 w-8" />, label: "Anos de Experiência", value: "5+" },
  { icon: <Star className="h-8 w-8" />, label: "Avaliação Média", value: "4.9/5" }
]

const features = [
  "Desenvolvimento ágil e iterativo",
  "Tecnologias modernas e escaláveis",
  "Suporte técnico 24/7",
  "Manutenção e atualizações",
  "Hospedagem e infraestrutura",
  "Treinamento da equipe"
]

export default function DeveloperPage() {
  const developerWhatsapp = "+55 (62) 99999-9999"
  const developerInstagram = "@kryonix.dev"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-primary border-primary/50">
                  Desenvolvimento de Software
                </Badge>
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  KRYONIX
                </h1>
                <p className="text-2xl text-muted-foreground">
                  Soluções Digitais Inovadoras
                </p>
                <p className="text-lg leading-relaxed">
                  Especialistas em criação de sites, aplicativos e software sob medida. 
                  Transformamos ideias em realidade digital com tecnologia de ponta e design excepcional.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">CEO & Fundador</p>
                    <p className="text-muted-foreground">Vitor Jayme Fernandes Ferreira</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(`https://wa.me/${developerWhatsapp.replace(/\D/g, "")}`, '_blank')}
                  >
                    <WhatsAppIcon className="h-5 w-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => window.open(`https://instagram.com/${developerInstagram.replace(/^@/, "")}`, '_blank')}
                  >
                    <InstagramIcon className="h-5 w-5 mr-2" />
                    Instagram
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl opacity-20 animate-pulse" />
                <Image 
                  src="/logo-kryonix.png" 
                  alt="Logo Kryonix" 
                  width={400} 
                  height={400} 
                  className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-card/50"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="text-primary mx-auto mb-2">{stat.icon}</div>
                    <CardTitle className="text-2xl font-bold text-primary">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        className="py-20"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <Badge variant="outline" className="mb-4">Nossos Serviços</Badge>
            <h2 className="text-4xl font-bold mb-4">Soluções Completas em Tecnologia</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos soluções completas para impulsionar seu negócio no mundo digital
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <CardHeader>
                    <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-muted/50"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-4">Por que Escolher a Kryonix?</Badge>
              <h2 className="text-4xl font-bold mb-6">
                Sua Parceira em Transformação Digital
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Combinamos experiência técnica com visão estratégica para entregar 
                soluções que realmente fazem a diferença no seu negócio.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-3"
                    variants={fadeInUp}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 bg-primary/10 border-primary/20">
                  <Target className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Foco em Resultados</h3>
                  <p className="text-sm text-muted-foreground">
                    Entregamos soluções que geram impacto real no seu negócio
                  </p>
                </Card>
                <Card className="p-6 bg-accent/10 border-accent/20 mt-8">
                  <Award className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">Qualidade Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Código limpo, documentado e seguindo as melhores práticas
                  </p>
                </Card>
                <Card className="p-6 bg-accent/10 border-accent/20 -mt-4">
                  <Zap className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">Agilidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Entregas rápidas sem comprometer a qualidade
                  </p>
                </Card>
                <Card className="p-6 bg-primary/10 border-primary/20 mt-4">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Segurança</h3>
                  <p className="text-sm text-muted-foreground">
                    Proteção de dados e segurança em todas as camadas
                  </p>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-primary to-accent text-white"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Transformar Sua Ideia em Realidade?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos impulsionar seu negócio 
            com soluções tecnológicas inovadoras.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => window.open(`https://wa.me/${developerWhatsapp.replace(/\D/g, "")}`, '_blank')}
            >
              <WhatsAppIcon className="h-5 w-5 mr-2" />
              Falar no WhatsApp
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => window.open(`https://instagram.com/${developerInstagram.replace(/^@/, "")}`, '_blank')}
            >
              <InstagramIcon className="h-5 w-5 mr-2" />
              Seguir no Instagram
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
