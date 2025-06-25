"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, BedSingle, Ruler, MapPin, XCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface ComparedProperty {
  id: string
  titulo: string
  preco: number
  tipo: string
  quartos: number
  area: number
  localizacao: string
  imageUrls?: string[]
  comodidades?: string[]
  descricao?: string
}

export default function CompararPage() {
  const [comparedProperties, setComparedProperties] = useState<ComparedProperty[]>([])

  useEffect(() => {
    const storedProperties = localStorage.getItem("comparedProperties")
    if (storedProperties) {
      setComparedProperties(JSON.parse(storedProperties))
    }
  }, [])

  const handleRemoveFromCompare = (propertyId: string) => {
    const updatedProperties = comparedProperties.filter((p) => p.id !== propertyId)
    setComparedProperties(updatedProperties)
    localStorage.setItem("comparedProperties", JSON.stringify(updatedProperties))
  }

  if (comparedProperties.length === 0) {
    return (
      <section className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Comparador de Imóveis</h1>
        <p className="text-muted-foreground">Nenhum imóvel para comparar ainda.</p>
        <p className="text-muted-foreground mt-2">
          Adicione imóveis ao comparador a partir das páginas de detalhes ou listagem.
        </p>
        <Link href="/imoveis">
          <Button className="mt-6">Ver Imóveis</Button>
        </Link>
      </section>
    )
  }

  // Extrair todas as comodidades únicas para a tabela de comparação
  const allComodidades = Array.from(new Set(comparedProperties.flatMap((p) => p.comodidades || []))).sort()

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight text-center mb-10">Comparar Imóveis</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left border-b-2 border-gray-200 bg-gray-50 min-w-[150px]">Característica</th>
              {comparedProperties.map((property) => (
                <th key={property.id} className="p-4 text-center border-b-2 border-gray-200 bg-gray-50 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveFromCompare(property.id)}
                  >
                    <XCircle className="h-5 w-5" />
                    <span className="sr-only">Remover</span>
                  </Button>
                  <Image
                    src={property.imageUrls?.[0] || "/placeholder.svg"}
                    alt={property.titulo}
                    width={200}
                    height={150}
                    className="rounded-md object-cover mx-auto mb-2"
                  />
                  <h2 className="text-lg font-bold">{property.titulo}</h2>
                  <p className="text-muted-foreground text-sm">{property.localizacao}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold">Preço</td>
              {comparedProperties.map((property) => (
                <td key={property.id} className="p-4 text-center">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(property.preco)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold flex items-center">
                <Home className="h-4 w-4 mr-2 text-primary" /> Tipo
              </td>
              {comparedProperties.map((property) => (
                <td key={property.id} className="p-4 text-center">
                  {property.tipo}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold flex items-center">
                <BedSingle className="h-4 w-4 mr-2 text-primary" /> Quartos
              </td>
              {comparedProperties.map((property) => (
                <td key={property.id} className="p-4 text-center">
                  {property.quartos}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold flex items-center">
                <Ruler className="h-4 w-4 mr-2 text-primary" /> Área (m²)
              </td>
              {comparedProperties.map((property) => (
                <td key={property.id} className="p-4 text-center">
                  {property.area}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" /> Localização
              </td>
              {comparedProperties.map((property) => (
                <td key={property.id} className="p-4 text-center">
                  {property.localizacao}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold">Descrição</td>
              {comparedProperties.map((property) => (
                <td key={property.id} className="p-4 text-center text-sm max-w-xs overflow-hidden text-ellipsis">
                  {property.descricao?.substring(0, 100)}...
                </td>
              ))}
            </tr>
            {allComodidades.map((comodidade) => (
              <tr key={comodidade} className="border-b border-gray-100">
                <td className="p-4 font-semibold">{comodidade}</td>
                {comparedProperties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    {property.comodidades?.includes(comodidade) ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-8">
        <Link href="/imoveis">
          <Button variant="outline">Voltar para Imóveis</Button>
        </Link>
      </div>
    </section>
  )
}
