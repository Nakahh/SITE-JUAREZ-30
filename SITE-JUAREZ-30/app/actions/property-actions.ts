"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function createProperty(formData: FormData) {
  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const preco = Number.parseFloat(formData.get("preco") as string)
  const tipo = formData.get("tipo") as string
  const quartos = Number.parseInt(formData.get("quartos") as string)
  const area = Number.parseFloat(formData.get("area") as string)
  const localizacao = formData.get("localizacao") as string
  const status = formData.get("status") as string
  const imageUrls = formData.getAll("imageUrls[]") as string[]
  const comodidades = ((formData.get("comodidades") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  const agentId = formData.get("agentId") as string | null // Novo campo

  await prisma.property.create({
    data: {
      titulo,
      descricao,
      preco,
      tipo,
      quartos,
      area,
      localizacao,
      status,
      imageUrls: imageUrls.filter((url) => url),
      comodidades,
      agentId: agentId || null, // Atribui o ID do corretor
    },
  })

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
  const status = formData.get("status") as string
  const imageUrls = formData.getAll("imageUrls[]") as string[]
  const comodidades = ((formData.get("comodidades") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  const agentId = formData.get("agentId") as string | null // Novo campo

  await prisma.property.update({
    where: { id },
    data: {
      titulo,
      descricao,
      preco,
      tipo,
      quartos,
      area,
      localizacao,
      status,
      imageUrls: imageUrls.filter((url) => url),
      comodidades,
      agentId: agentId || null, // Atribui o ID do corretor
    },
  })

  revalidatePath("/admin/imoveis")
  redirect("/admin/imoveis")
}

export async function deleteProperty(id: string) {
  await prisma.property.delete({
    where: { id },
  })

  revalidatePath("/admin/imoveis")
}
