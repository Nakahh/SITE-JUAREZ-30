import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PrismaClient } from "@prisma/client"
import { PropertyCard } from "@/components/property-card"
import { NewsletterForm } from "@/components/newsletter-form"

const prisma = new PrismaClient()

export default async function Home() {
  const featuredProperties = await prisma.property.findMany({
    take: 3, // Get 3 featured properties
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <>
      <section className="container py-12">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Encontre o imóvel dos seus sonhos em Siqueira Campos</h1>
            <p className="mt-4 text-muted-foreground">
              A Siqueira Campos Imóveis oferece uma ampla seleção de imóveis para compra e aluguel na região.
            </p>
            <div className="mt-6 space-x-4">
              <Link href="/imoveis">
                <Button>Ver Imóveis</Button>
              </Link>
              <Link href="/contato">
                <Button variant="outline">Entre em Contato</Button>
              </Link>
            </div>
          </div>
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Imóvel em destaque"
            width={600}
            height={400}
            className="rounded-md"
          />
        </div>
      </section>

      <section className="container py-16 bg-gray-50">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Imóveis em Destaque</h2>
        {featuredProperties.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum imóvel em destaque no momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/imoveis">
            <Button variant="outline">Ver Todos os Imóveis</Button>
          </Link>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Receba Novidades por Email</h2>
        <NewsletterForm />
      </section>
    </>
  )
}
