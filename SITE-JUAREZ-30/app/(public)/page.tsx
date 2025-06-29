import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyCard } from "@/components/property-card" 
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic" // Adicionado para evitar erro de conexão com DB no build

export default async function HomePage() {
  const latestProperties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  return (
    <main className="flex-1">
      <section
        className="relative w-full h-[60vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="z-10 text-white space-y-4">
          <h1 className="text-5xl font-bold">Encontre o Imóvel dos Seus Sonhos</h1>
          <p className="text-xl">Milhares de imóveis disponíveis para você.</p>
          <Link href="/imoveis">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Ver Imóveis
            </Button>
          </Link>
        </div>
      </section>

      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Imóveis Recentes</h2>
        {latestProperties.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum imóvel cadastrado ainda.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link href="/imoveis">
            <Button variant="outline">Ver Todos os Imóveis</Button>
          </Link>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Por que escolher a Siqueira Campos Imóveis?</h2>
            <p className="text-muted-foreground">
              Oferecemos uma experiência completa e personalizada para você encontrar o imóvel ideal.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Ampla variedade de imóveis</li>
              <li>Corretores experientes e dedicados</li>
              <li>Processo de compra e venda simplificado</li>
              <li>Suporte completo do início ao fim</li>
            </ul>
            <Link href="/contato">
              <Button>Fale Conosco</Button>
            </Link>
          </div>
          <div className="relative h-64 w-full rounded-lg overflow-hidden">
            <Image src="/placeholder.jpg" alt="Why choose us" fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section>

      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Depoimentos de Clientes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Excelente Serviço!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "Encontrei meu apartamento dos sonhos com a ajuda da Siqueira Campos Imóveis. O processo foi rápido e
                sem complicações."
              </p>
              <p className="mt-4 font-semibold">- Maria Silva</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profissionalismo e Dedicação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "Os corretores são muito atenciosos e me ajudaram em cada etapa da compra. Recomendo a todos!"
              </p>
              <p className="mt-4 font-semibold">- João Santos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Melhor Experiência!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "Vendi meu imóvel rapidamente e com um ótimo preço. A equipe é super competente."
              </p>
              <p className="mt-4 font-semibold">- Ana Costa</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Link href="/depoimentos">
            <Button variant="outline">Ver Todos os Depoimentos</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
