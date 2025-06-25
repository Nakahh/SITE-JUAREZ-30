"use client"

import { PrismaClient } from "@prisma/client"
import { PropertyCard } from "@/components/property-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, XCircle } from "lucide-react"
import { Suspense } from "react"
import { PropertyListSkeleton } from "./loading"
import Link from "next/link"

const prisma = new PrismaClient()

interface PropertiesPageProps {
  searchParams: {
    search?: string
    tipo?: string
    minPreco?: string
    maxPreco?: string
    quartos?: string
    banheiros?: string
    garagem?: string
    minArea?: string
    maxArea?: string
    comodidades?: string // IDs das comodidades separados por vírgula
    orderBy?: string // 'preco_asc', 'preco_desc', 'area_asc', 'area_desc', 'recentes'
  }
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const { search, tipo, minPreco, maxPreco, quartos, banheiros, garagem, minArea, maxArea, comodidades, orderBy } =
    searchParams

  const where: any = {}
  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: "insensitive" } },
      { descricao: { contains: search, mode: "insensitive" } },
      { localizacao: { contains: search, mode: "insensitive" } },
    ]
  }
  if (tipo) {
    where.tipo = tipo
  }
  if (minPreco) {
    where.preco = { ...where.preco, gte: Number.parseFloat(minPreco) }
  }
  if (maxPreco) {
    where.preco = { ...where.preco, lte: Number.parseFloat(maxPreco) }
  }
  if (quartos) {
    where.quartos = { gte: Number.parseInt(quartos) }
  }
  if (banheiros) {
    where.banheiros = { gte: Number.parseInt(banheiros) }
  }
  if (garagem) {
    where.garagem = { gte: Number.parseInt(garagem) }
  }
  if (minArea) {
    where.area = { ...where.area, gte: Number.parseFloat(minArea) }
  }
  if (maxArea) {
    where.area = { ...where.area, lte: Number.parseFloat(maxArea) }
  }
  if (comodidades) {
    const comodidadeIds = comodidades.split(",")
    where.comodidades = {
      some: {
        id: {
          in: comodidadeIds,
        },
      },
    }
  }

  let orderByClause: any = { createdAt: "desc" } // Default
  if (orderBy === "preco_asc") {
    orderByClause = { preco: "asc" }
  } else if (orderBy === "preco_desc") {
    orderByClause = { preco: "desc" }
  } else if (orderBy === "area_asc") {
    orderByClause = { area: "asc" }
  } else if (orderBy === "area_desc") {
    orderByClause = { area: "desc" }
  } else if (orderBy === "recentes") {
    orderByClause = { createdAt: "desc" }
  }

  const allComodidades = await prisma.comodidade.findMany({
    orderBy: { nome: "asc" },
  })

  const properties = await prisma.property.findMany({
    where,
    orderBy: orderByClause,
    include: {
      images: true,
      comodidades: true,
    },
  })

  const currentSearchParams = new URLSearchParams(searchParams as any).toString()
  const hasActiveFilters = currentSearchParams !== "" && currentSearchParams !== "orderBy=recentes"

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight text-center mb-10">Imóveis Disponíveis</h1>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar de Filtros */}
        <aside className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Filtros</h2>
          <form className="space-y-6">
            <div>
              <Label htmlFor="search">Buscar por palavra-chave</Label>
              <div className="relative mt-1">
                <Input
                  id="search"
                  name="search"
                  placeholder="Ex: Apartamento, Centro"
                  defaultValue={search}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Imóvel</Label>
              <Select name="tipo" defaultValue={tipo}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preço (R$)</Label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <Input type="number" name="minPreco" placeholder="Mínimo" defaultValue={minPreco} />
                <Input type="number" name="maxPreco" placeholder="Máximo" defaultValue={maxPreco} />
              </div>
            </div>

            <div>
              <Label>Quartos</Label>
              <Input type="number" name="quartos" placeholder="Mínimo de quartos" defaultValue={quartos} min="0" />
            </div>

            <div>
              <Label>Banheiros</Label>
              <Input
                type="number"
                name="banheiros"
                placeholder="Mínimo de banheiros"
                defaultValue={banheiros}
                min="0"
              />
            </div>

            <div>
              <Label>Vagas de Garagem</Label>
              <Input type="number" name="garagem" placeholder="Mínimo de vagas" defaultValue={garagem} min="0" />
            </div>

            <div>
              <Label>Área (m²)</Label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <Input type="number" name="minArea" placeholder="Mínima" defaultValue={minArea} />
                <Input type="number" name="maxArea" placeholder="Máxima" defaultValue={maxArea} />
              </div>
            </div>

            <div>
              <Label>Comodidades</Label>
              <div className="mt-2 space-y-2">
                {allComodidades.map((comodidade) => (
                  <div key={comodidade.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`comodidade-${comodidade.id}`}
                      name="comodidades"
                      value={comodidade.id}
                      defaultChecked={comodidades?.split(",").includes(comodidade.id)}
                    />
                    <Label htmlFor={`comodidade-${comodidade.id}`}>{comodidade.nome}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" /> Aplicar Filtros
            </Button>
            {hasActiveFilters && (
              <Link href="/imoveis" className="w-full">
                <Button variant="outline" className="w-full mt-2">
                  <XCircle className="mr-2 h-4 w-4" /> Limpar Filtros
                </Button>
              </Link>
            )}
          </form>
        </aside>

        {/* Lista de Imóveis */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Resultados ({properties.length} imóveis)</h2>
            <Select
              name="orderBy"
              defaultValue={orderBy || "recentes"}
              onValueChange={(value) => {
                const params = new URLSearchParams(searchParams as any)
                params.set("orderBy", value)
                window.location.search = params.toString()
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recentes">Mais Recentes</SelectItem>
                <SelectItem value="preco_asc">Preço: Menor para Maior</SelectItem>
                <SelectItem value="preco_desc">Preço: Maior para Menor</SelectItem>
                <SelectItem value="area_asc">Área: Menor para Maior</SelectItem>
                <SelectItem value="area_desc">Área: Maior para Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Suspense fallback={<PropertyListSkeleton />}>
            {properties.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhum imóvel encontrado com os filtros aplicados.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </section>
  )
}
