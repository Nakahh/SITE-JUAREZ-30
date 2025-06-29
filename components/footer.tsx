import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, MapPin, Phone, Mail, Clock, Award, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10" />

      {/* Main Footer Content */}
      <div className="relative z-10 container-premium py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo e Descrição */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-4">
              <Image
                src="/siqueira campos para fundo escuro.png"
                alt="Siqueira Campos Imóveis"
                width={180}
                height={60}
                className="siqueira-logo siqueira-logo-md"
                priority
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Há mais de 15 anos transformando sonhos em realidade no mercado imobiliário de Goiânia. 
              Sua confiança é nossa missão.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/siqueiracamposimoveis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/siqueiracamposimoveis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold gradient-text-secondary">Links Rápidos</h3>
            <nav className="space-y-3">
              {[
                { href: '/imoveis', label: 'Imóveis' },
                { href: '/sobre', label: 'Sobre Nós' },
                { href: '/corretores', label: 'Corretores' },
                { href: '/blog', label: 'Blog' },
                { href: '/depoimentos', label: 'Depoimentos' },
                { href: '/contato', label: 'Contato' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 hover:text-accent hover:translate-x-2 transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Serviços */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold gradient-text-secondary">Nossos Serviços</h3>
            <nav className="space-y-3">
              {[
                'Venda de Imóveis',
                'Locação Residencial',
                'Locação Comercial',
                'Avaliação Imobiliária',
                'Consultoria',
                'Financiamento'
              ].map((service) => (
                <div key={service} className="text-gray-300 text-sm hover:text-accent transition-colors duration-300">
                  {service}
                </div>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold gradient-text-secondary">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>Rua das Flores, 123</p>
                  <p>Setor Central, Goiânia - GO</p>
                  <p>CEP: 74000-000</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>(62) 3333-4444</p>
                  <p>(62) 99999-8888</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <p className="text-gray-300 text-sm">contato@siqueiracampos.com.br</p>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábado: 8h às 12h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Certificações */}
      <div className="relative z-10 border-t border-white/10">
        <div className="container-premium py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-accent" />
                <span className="text-sm text-gray-300">CRECI-GO Certificado</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-accent" />
                <span className="text-sm text-gray-300">Empresa Verificada</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © 2024 Siqueira Campos Imóveis. Todos os direitos reservados.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Desenvolvido por <Link href="/kryonix" className="text-accent hover:text-accent/80 transition-colors">Kryonix</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Exportação nomeada para compatibilidade
export { Footer }