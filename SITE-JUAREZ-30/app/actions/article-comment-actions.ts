"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/app/api/auth/[...nextauth]/route"

export async function createArticleComment(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Você precisa estar logado para comentar." }
  }

  const articleId = formData.get("articleId") as string
  const content = formData.get("content") as string

  if (!articleId || !content) {
    return { success: false, message: "Conteúdo do comentário inválido." }
  }

  try {
    const article = await prisma.article.findUnique({ where: { id: articleId } })
    if (!article) {
      return { success: false, message: "Artigo não encontrado." }
    }

    await prisma.articleComment.create({
      data: {
        articleId,
        userId: session.user.id,
        content,
      },
    })
    revalidatePath(`/blog/${article.slug}`)
    return { success: true, message: "Comentário adicionado com sucesso!" }
  } catch (error) {
    console.error("Erro ao criar comentário de artigo:", error)
    return { success: false, message: "Erro ao adicionar comentário." }
  }
}

export async function deleteArticleComment(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Você precisa estar logado para excluir um comentário." }
  }

  try {
    const existingComment = await prisma.articleComment.findUnique({ where: { id } })
    if (!existingComment || existingComment.userId !== session.user.id) {
      return { success: false, message: "Você não tem permissão para excluir este comentário." }
    }

    const article = await prisma.article.findUnique({ where: { id: existingComment.articleId } })

    await prisma.articleComment.delete({ where: { id } })
    if (article) {
      revalidatePath(`/blog/${article.slug}`)
    }
    return { success: true, message: "Comentário excluído com sucesso!" }
  } catch (error) {
    console.error("Erro ao excluir comentário de artigo:", error)
    return { success: false, message: "Erro ao excluir comentário." }
  }
}
