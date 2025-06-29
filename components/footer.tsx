
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import SiqueiraLogo from '@/components/siqueira-logo'
import KryonixLogo from '@/components/kryonix-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { InstagramIcon } from '@/components/instagram-icon'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  ArrowRight,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Star,
  Home,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme } = useTheme()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Implementar ação de newsletter aqui
      console.log('Newsletter subscription:', email)
      setEmail('')
    } catch (error) {
      console.error('Erro ao inscrever na newsletter:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const quickLinks = [
    { href: '/imoveis', label: 'Imóveis' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/contato', label: 'Contato' },
    { href: '/blog', label: 'Blog' },
    { href: '/depoimentos', label: 'Depoimentos' },
    { href: '/simulador-financiamento', label: 'Simulador' }
  ]

  const services = [
    { href: '/imoveis?tipo=venda', label: 'Comprar Imóvel' },
    { href: '/imoveis?tipo=aluguel', label: 'Alugar Imóvel' },
    { href: '/contato', label: 'Avaliação Gratuita' },
    { href: '/simulador-financiamento', label: 'Financiamento' },
    { href: '/corretores', label: 'Nossos Corretores' },
    { href: '/comparar', label: 'Comparar Imóveis' }
  ]

  const stats = [
    { icon: Home, value: '500+', label: 'Imóveis Vendidos' },
    { icon: Users, value: '1000+', label: 'Clientes Satisfeitos' },
    { icon: TrendingUp, value: '15+', label: 'Anos de Experiência' },
    { icon: Shield, value: '100%', label: 'Segurança Garantida' }
  ]

  return (
    <footer className="bg-background border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Fique por dentro das melhores oportunidades
            </h3>
            <p className="text-muted-foreground mb-6">
              Receba em primeira mão os melhores imóveis e dicas exclusivas do mercado imobiliário
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting} className="sm:w-auto">
                {isSubmitting ? 'Inscrevendo...' : 'Inscrever-se'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <SiqueiraLogo width={200} height={60} className="h-12 w-auto" priority />
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Há mais de 15 anos realizando sonhos e transformando vidas através do mercado imobiliário. 
                Sua confiança é nossa maior conquista.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Rua Principal, 123 - Centro, Cidade - Estado</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>(62) 9 8556-3905</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>siqueiraecamposimoveis@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Seg - Sex: 8h às 18h | Sáb: 8h às 12h</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Links Rápidos</h4>
              <nav className="space-y-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Nossos Serviços</h4>
              <nav className="space-y-3">
                {services.map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {service.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social & Reviews */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Conecte-se</h4>
              
              {/* Social Links */}
              <div className="flex space-x-3 mb-6">
                <Button size="sm" variant="outline" className="p-2">
                  <WhatsAppIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2">
                  <InstagramIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>

              {/* Reviews */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9/5</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Baseado em mais de 500 avaliações de clientes satisfeitos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Siqueira Campos Imóveis. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/politica-privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Termos de Uso
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Desenvolvido por</span>
                <KryonixLogo width={24} height={24} linkTo="/desenvolvedor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
