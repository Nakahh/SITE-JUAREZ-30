'use client'

import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PropertyCard } from "@/components/property-card"
import { NewsletterForm } from "@/components/newsletter-form"
import { FloatingChatBubble } from "@/components/floating-chat-bubble"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { InstagramIcon } from "@/components/instagram-icon"
import { 
  Search, 
  MapPin, 
  Home, 
  Building2, 
  Key, 
  Star, 
  Calculator,
  ChevronRight,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Phone,
  Mail,
  Heart,
  Calendar,
  MessageCircle,
  Play
} from "lucide-react"
import { getProperties } from "@/app/actions/property-actions"
import { getTestimonials } from "@/app/actions/testimonial-actions"
import { getRecentArticles } from "@/app/actions/article-actions"

// Dados mockados para demonstração
const featuredProperties = [
  {
    id: "1",
    title: "Casa Moderna no Condomínio Jardins",
    price: 850000,
    type: "HOUSE",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    address: "Jardins Residence, Goiânia - GO",
    images: ["/imoveis/casa-condominio-1.jpg"],
    status: "AVAILABLE"
  },
  {
    id: "2", 
    title: "Apartamento Luxuoso Centro",
    price: 450000,
    type: "APARTMENT",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    address: "Centro, Goiânia - GO",
    images: ["/placeholder.jpg"],
    status: "AVAILABLE"
  },
  {
    id: "3",
    title: "Sobrado Familiar Setor Oeste",
    price: 680000,
    type: "HOUSE",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    address: "Setor Oeste, Goiânia - GO", 
    images: ["/placeholder.jpg"],
    status: "AVAILABLE"
  }
]

const testimonials = [
  {
    id: "1",
    name: "Maria Silva",
    content: "Excelente atendimento! Encontrei minha casa dos sonhos rapidamente. A equipe foi muito profissional e atenciosa durante todo o processo.",
    rating: 5,
    image: "/placeholder-user.jpg",
    location: "Goiânia - GO"
  },
  {
    id: "2", 
    name: "João Santos",
    content: "Processo de compra muito tranquilo e transparente. Recomendo a Siqueira Campos para quem busca qualidade no atendimento.",
    rating: 5,
    image: "/placeholder-user.jpg",
    location: "Aparecida de Goiânia - GO"
  },
  {
    id: "3",
    name: "Ana Costa",
    content: "Venderam meu apartamento em tempo recorde! Profissionais competentes e dedicados. Muito satisfeita com o resultado.",
    rating: 5,
    image: "/placeholder-user.jpg",
    location: "Senador Canedo - GO"
  }
]

const recentArticles = [
  {
    id: "1",
    title: "Dicas para Primeira Compra de Imóvel",
    excerpt: "Guia completo para quem está comprando o primeiro imóvel. Documentação, financiamento e muito mais.",
    slug: "dicas-primeira-compra-imovel",
    publishedAt: new Date("2024-01-15"),
    image: "/placeholder.jpg"
  },
  {
    id: "2",
    title: "Mercado Imobiliário em Goiânia 2024",
    excerpt: "Análise do mercado imobiliário local com tendências e oportunidades para investidores.",
    slug: "mercado-imobiliario-goiania-2024", 
    publishedAt: new Date("2024-01-10"),
    image: "/placeholder.jpg"
  },
  {
    id: "3",
    title: "Financiamento Imobiliário: Como Escolher",
    excerpt: "Comparativo entre SAC e Price, documentação necessária e dicas para aprovação.",
    slug: "financiamento-imobiliario-como-escolher",
    publishedAt: new Date("2024-01-05"),
    image: "/placeholder.jpg"
  }
]

const faqItems = [
  {
    question: "Como posso agendar uma visita ao imóvel?",
    answer: "Você pode agendar uma visita diretamente pelo site clicando no botão 'Agendar Visita' na página do imóvel, ou entrando em contato conosco pelo WhatsApp (62) 9 8556-3905."
  },
  {
    question: "Quais documentos preciso para financiamento?",
    answer: "Para solicitar financiamento você precisará de: RG, CPF, comprovante de renda dos últimos 3 meses, comprovante de residência, extrato bancário e certidões negativas."
  },
  {
    question: "Vocês trabalham com permuta?",
    answer: "Sim! Trabalhamos com permuta de imóveis. Nossa equipe pode avaliar seu imóvel atual e encontrar opções que se adequem ao seu perfil."
  },
  {
    question: "Qual a comissão para venda do meu imóvel?",
    answer: "Nossa comissão é competitiva no mercado. Entre em contato para uma avaliação gratuita e conhecer nossas condições especiais."
  },
  {
    question: "Oferecem consultoria para investimentos?",
    answer: "Sim! Temos especialistas em investimentos imobiliários que podem orientá-lo nas melhores oportunidades do mercado."
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <FloatingChatBubble />

      {/* Hero Section com Background Profundo */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background com profundidade */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('/hero-bg.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Elementos flutuantes animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-pink-500/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-cyan-500/20 rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Encontre Seu
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Lar Ideal</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-delay">
              Mais de 15 anos conectando pessoas aos seus sonhos. Descubra imóveis únicos em Goiânia e região.
            </p>

            {/* Busca Rápida */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Tipo de Imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOUSE">Casa</SelectItem>
                    <SelectItem value="APARTMENT">Apartamento</SelectItem>
                    <SelectItem value="COMMERCIAL">Comercial</SelectItem>
                  </SelectContent>
                </Select>

                <Input 
                  placeholder="Localização" 
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                />

                <Input 
                  placeholder="Preço máximo" 
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                />

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center animate-fade-in">
                <div className="text-3xl font-bold text-blue-400">500+</div>
                <div className="text-sm text-gray-300">Imóveis Vendidos</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl font-bold text-purple-400">15+</div>
                <div className="text-sm text-gray-300">Anos de Experiência</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl font-bold text-pink-400">98%</div>
                <div className="text-sm text-gray-300">Clientes Satisfeitos</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl font-bold text-cyan-400">24h</div>
                <div className="text-sm text-gray-300">Suporte Online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white rotate-90" />
        </div>
      </section>

      {/* Imóveis em Destaque */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Imóveis em Destaque
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selecionamos os melhores imóveis para você. Qualidade, localização e preço justo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    width={400}
                    height={250}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white">Destaque</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg line-clamp-2">{property.title}</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {property.price.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {property.address}
                  </p>

                  <div className="flex justify-between text-sm text-muted-foreground mb-6">
                    <span>{property.bedrooms} quartos</span>
                    <span>{property.bathrooms} banheiros</span>
                    <span>{property.area}m²</span>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/imoveis/${property.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Visita
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Link href="/imoveis">
                Ver Todos os Imóveis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Simulador de Financiamento */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Simule seu Financiamento</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Descubra quanto você pode financiar e qual será sua parcela mensal
            </p>

            <Card className="p-8 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor do Imóvel</label>
                    <Input placeholder="R$ 500.000" className="text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Entrada</label>
                    <Input placeholder="R$ 100.000" className="text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prazo (anos)</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o prazo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 anos</SelectItem>
                        <SelectItem value="15">15 anos</SelectItem>
                        <SelectItem value="20">20 anos</SelectItem>
                        <SelectItem value="25">25 anos</SelectItem>
                        <SelectItem value="30">30 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" size="lg">
                    <Calculator className="mr-2 h-4 w-4" />
                    Simular Financiamento
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                  <div className="text-center">
                    <Calculator className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-semibold mb-2">Resultado da Simulação</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Parcela Mensal (SAC)</p>
                        <p className="text-2xl font-bold text-green-600">R$ 2.847</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Parcela Mensal (PRICE)</p>
                        <p className="text-2xl font-bold text-blue-600">R$ 3.012</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="mt-4">
                      <Link href="/simulador-financiamento">
                        Simulação Completa
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-lg text-muted-foreground">
              Histórias reais de quem realizou o sonho da casa própria conosco
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/depoimentos">
                Ver Todos os Depoimentos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog/Artigos */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Blog Imobiliário</h2>
            <p className="text-lg text-muted-foreground">
              Dicas, tendências e informações valiosas sobre o mercado imobiliário
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <Card key={article.id} className="group hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">
                    {article.publishedAt.toLocaleDateString('pt-BR')}
                  </div>
                  <h3 className="font-semibold text-lg mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Button asChild variant="link" className="p-0">
                    <Link href={`/blog/${article.slug}`}>
                      Ler mais <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/blog">
                Ver Todos os Artigos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Perguntas Frequentes</h2>
              <p className="text-lg text-muted-foreground">
                Tire suas dúvidas sobre nossos serviços
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-gray-800 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Não encontrou sua resposta?
              </p>
              <Button asChild size="lg">
                <Link href="/contato">
                  Entre em Contato
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Receba as Melhores Oportunidades
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Cadastre-se e seja o primeiro a saber sobre novos imóveis e promoções exclusivas
          </p>

          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para encontrar seu novo lar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudá-lo em cada etapa. Entre em contato e realize seu sonho hoje mesmo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-green-700">
              <a href={`https://wa.me/5562985563905`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="mr-2 h-5 w-5" />
                WhatsApp: (62) 9 8556-3905
              </a>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/contato">
                <Mail className="mr-2 h-5 w-5" />
                Formulário de Contato
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}