"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function createTestimonial(formData: FormData) {
  const session = await getServerSession(authOptions)
  const content = formData.get("content") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const authorName = formData.get("authorName") as string

  if (!content || !authorName || isNaN(rating) || rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Por favor, preencha todos os campos obrigatórios e forneça uma avaliação válida.",
    }
  }

  try {
    await prisma.testimonial.create({
      data: {
        content,
        rating,
        authorName,
        authorId: session?.user?.id || null, // Associa ao usuário logado se houver
        approved: false, // Depoimentos precisam ser aprovados por padrão
      },
    })
    revalidatePath("/depoimentos")
    return { success: true, message: "Depoimento enviado com sucesso! Ele será publicado após aprovação." }
  } catch (error) {
    console.error("Erro ao criar depoimento:", error)
    return { success: false, message: "Erro ao enviar depoimento. Tente novamente." }
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  const content = formData.get("content") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const authorName = formData.get("authorName") as string
  const approved = formData.get("approved") === "on" // Checkbox value

  if (!content || !authorName || isNaN(rating) || rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Por favor, preencha todos os campos obrigatórios e forneça uma avaliação válida.",
    }
  }

  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        content,
        rating,
        authorName,
        approved,
      },
    })
    revalidatePath("/admin/depoimentos")
    revalidatePath("/depoimentos")
    redirect("/admin/depoimentos")
  } catch (error) {
    console.error("Erro ao atualizar depoimento:", error)
    return { success: false, message: "Erro ao atualizar depoimento. Tente novamente." }
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    })
    revalidatePath("/admin/depoimentos")
    revalidatePath("/depoimentos")
    return { success: true, message: "Depoimento excluído com sucesso." }
  } catch (error) {
    console.error("Erro ao deletar depoimento:", error)
    return { success: false, message: "Erro ao deletar depoimento. Tente novamente." }
  }
}

export async function approveTestimonial(id: string) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { approved: true },
    })
    revalidatePath("/admin/depoimentos")
    revalidatePath("/depoimentos")
    return { success: true, message: "Depoimento aprovado com sucesso." }
  } catch (error) {
    console.error("Erro ao aprovar depoimento:", error)
    return { success: false, message: "Erro ao aprovar depoimento. Tente novamente." }
  }
}
