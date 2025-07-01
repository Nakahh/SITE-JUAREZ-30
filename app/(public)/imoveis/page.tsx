import prisma from "@/lib/prisma";
import { EnhancedPropertyCard } from "@/components/enhanced-property-card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PropertiesPageProps {
  searchParams: {
    search?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    orderBy?: string;
  };
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const { search, type, minPrice, maxPrice, bedrooms, orderBy } = searchParams;

  let properties = [];

  try {
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type && type !== "todos") {
      where.type = {
        contains: type,
        mode: "insensitive",
      };
    }

    if (minPrice) {
      where.price = { ...where.price, gte: Number.parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: Number.parseFloat(maxPrice) };
    }

    if (bedrooms) {
      where.bedrooms = { gte: Number.parseInt(bedrooms) };
    }

    let orderByClause: any = { createdAt: "desc" };
    if (orderBy === "price_asc") {
      orderByClause = { price: "asc" };
    } else if (orderBy === "price_desc") {
      orderByClause = { price: "desc" };
    } else if (orderBy === "area_asc") {
      orderByClause = { area: "asc" };
    } else if (orderBy === "area_desc") {
      orderByClause = { area: "desc" };
    }

    properties = await prisma.property.findMany({
      where,
      orderBy: orderByClause,
      include: {
        agent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar propriedades:", error);
    properties = [];
  }

  const presetFilters = [
    { label: "Casas até R$ 600k", href: "/imoveis?type=Casa&maxPrice=600000" },
    {
      label: "Apartamentos 2 quartos",
      href: "/imoveis?type=Apartamento&bedrooms=2",
    },
    { label: "Coberturas", href: "/imoveis?type=Cobertura" },
    { label: "Para Alugar", href: "/imoveis" },
    { label: "Luxo (R$ 800k+)", href: "/imoveis?minPrice=800000" },
    { label: "Todos", href: "/imoveis" },
  ];

  return (
    <section className="container py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Imóveis Disponíveis
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          Encontre o imóvel dos seus sonhos em nossa seleção exclusiva
        </p>

        {/* Filtros pré-definidos */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {presetFilters.map((filter, index) => (
            <Link
              key={index}
              href={filter.href}
              className="px-4 py-2 text-sm bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar de Filtros */}
        <aside className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Filtros</h2>
          <form method="get" className="space-y-6">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium mb-2"
              >
                Buscar por palavra-chave
              </label>
              <div className="relative">
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
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                Tipo de Imóvel
              </label>
              <Select name="type" defaultValue={type}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Cobertura">Cobertura</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Preço (R$)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  name="minPrice"
                  placeholder="Mínimo"
                  defaultValue={minPrice}
                />
                <Input
                  type="number"
                  name="maxPrice"
                  placeholder="Máximo"
                  defaultValue={maxPrice}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium mb-2"
              >
                Quartos
              </label>
              <Input
                type="number"
                id="bedrooms"
                name="bedrooms"
                placeholder="Mínimo de quartos"
                defaultValue={bedrooms}
                min="0"
              />
            </div>

            <div>
              <label
                htmlFor="orderBy"
                className="block text-sm font-medium mb-2"
              >
                Ordenar por
              </label>
              <Select name="orderBy" defaultValue={orderBy || "recent"}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="price_asc">
                    Preço: Menor para Maior
                  </SelectItem>
                  <SelectItem value="price_desc">
                    Preço: Maior para Menor
                  </SelectItem>
                  <SelectItem value="area_asc">
                    Área: Menor para Maior
                  </SelectItem>
                  <SelectItem value="area_desc">
                    Área: Maior para Menor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" /> Aplicar Filtros
            </Button>
          </form>
        </aside>

        {/* Lista de Imóveis */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Resultados ({properties.length} imóveis)
            </h2>
          </div>

          {properties.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Nenhum imóvel encontrado com os filtros aplicados.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <EnhancedPropertyCard
                  key={property.id}
                  property={{
                    id: property.id,
                    title: property.title,
                    description: property.description,
                    price: property.price,
                    type: property.type,
                    status: property.status,
                    address: property.address,
                    city: property.city,
                    state: property.state,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    area: property.area,
                    garage: property.garage,
                    pool: property.pool || false,
                    balcony: property.balcony || false,
                    images: Array.isArray(property.images)
                      ? property.images
                      : [],
                    createdAt: property.createdAt,
                    agent: property.agent,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
