"use server"

import { PrismaClient, PropertyStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { logActivity } from "@/lib/logger"

const prisma = new PrismaClient()

export async function createProperty(formData: FormData) {
  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const preco = Number.parseFloat(formData.get("preco") as string)
  const tipo = formData.get("tipo") as string
  const quartos = Number.parseInt(formData.get("quartos") as string)
  const area = Number.parseFloat(formData.get("area") as string)
  const localizacao = formData.get("localizacao") as string
  const statusStr = formData.get("status") as string
  const status = PropertyStatus[statusStr as keyof typeof PropertyStatus]
  const imageUrls = formData.getAll("imageUrls[]") as string[]
  const comodidades = ((formData.get("comodidades") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  // Ajuste para o campo correto no schema Prisma
  const amenities = comodidades
  const agentId = formData.get("agentId") as string | null // Novo campo

  const property = await prisma.property.create({
    data: {
      title: titulo,
      description: descricao,
      price: preco,
      type: tipo,
      bedrooms: quartos,
      area: area,
      address: localizacao,
      status,
      images: imageUrls.filter((url) => url),
      comodidades: amenities,
      agentId: agentId || null, // Atribui o ID do corretor
    },
  })

  await logActivity(agentId, "createProperty", `Imóvel criado: ${titulo}`)

  revalidatePath("/admin/imoveis")
  redirect("/admin/imoveis")
}

export async function updateProperty(id: string, formData: FormData) {
  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const preco = Number.parseFloat(formData.get("preco") as string)
  const tipo = formData.get("tipo") as string
  const quartos = Number.parseInt(formData.get("quartos") as string)
  const area = Number.parseFloat(formData.get("area") as string)
  const localizacao = formData.get("localizacao") as string
  const statusStr = formData.get("status") as string
  const status = PropertyStatus[statusStr as keyof typeof PropertyStatus]
  const imageUrls = formData.getAll("imageUrls[]") as string[]
  const comodidades = ((formData.get("comodidades") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  const agentId = formData.get("agentId") as string | null // Novo campo

  await prisma.property.update({
    where: { id },
    data: {
      title: titulo,
      description: descricao,
      price: preco,
      type: tipo,
      bedrooms: quartos,
      area: area,
      address: localizacao,
      status,
      images: imageUrls.filter((url) => url),
      comodidades: amenities,
      agentId: agentId || null, // Atribui o ID do corretor
    },
  })

  await logActivity(agentId, "updateProperty", `Imóvel atualizado: ${titulo}`)

  revalidatePath("/admin/imoveis")
  redirect("/admin/imoveis")
}

export async function deleteProperty(id: string) {
  await prisma.property.delete({
    where: { id },
  })

  await logActivity(null, "deleteProperty", `Imóvel excluído: ${id}`)

  revalidatePath("/admin/imoveis")
}
