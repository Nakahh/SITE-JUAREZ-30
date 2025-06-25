"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function createPropertyReview(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Você precisa estar logado para avaliar um imóvel." }
  }

  const propertyId = formData.get("propertyId") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string

  if (!propertyId || !rating) {
    return { success: false, message: "Dados inválidos para a avaliação." }
  }

  try {
    await prisma.propertyReview.create({
      data: {
        propertyId,
        userId: session.user.id,
        rating,
        comment,
      },
    })
    revalidatePath(`/imoveis/${propertyId}`)
    revalidatePath(`/dashboard/minhas-avaliacoes`)
    return { success: true, message: "Avaliação enviada com sucesso!" }
  } catch (error) {
    console.error("Erro ao criar avaliação de imóvel:", error)
    return { success: false, message: "Erro ao enviar avaliação." }
  }
}

export async function updatePropertyReview(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Você precisa estar logado para editar uma avaliação." }
  }

  const rating = Number.parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string

  if (!id || !rating) {
    return { success: false, message: "Dados inválidos para a avaliação." }
  }

  try {
    const existingReview = await prisma.propertyReview.findUnique({ where: { id } })
    if (!existingReview || existingReview.userId !== session.user.id) {
      return { success: false, message: "Você não tem permissão para editar esta avaliação." }
    }

    await prisma.propertyReview.update({
      where: { id },
      data: {
        rating,
        comment,
      },
    })
    revalidatePath(`/imoveis/${existingReview.propertyId}`)
    revalidatePath(`/dashboard/minhas-avaliacoes`)
    return { success: true, message: "Avaliação atualizada com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar avaliação de imóvel:", error)
    return { success: false, message: "Erro ao atualizar avaliação." }
  }
}

export async function deletePropertyReview(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Você precisa estar logado para excluir uma avaliação." }
  }

  try {
    const existingReview = await prisma.propertyReview.findUnique({ where: { id } })
    if (!existingReview || existingReview.userId !== session.user.id) {
      return { success: false, message: "Você não tem permissão para excluir esta avaliação." }
    }

    await prisma.propertyReview.delete({ where: { id } })
    revalidatePath(`/imoveis/${existingReview.propertyId}`)
    revalidatePath(`/dashboard/minhas-avaliacoes`)
    return { success: true, message: "Avaliação excluída com sucesso!" }
  } catch (error) {
    console.error("Erro ao excluir avaliação de imóvel:", error)
    return { success: false, message: "Erro ao excluir avaliação." }
  }
}
