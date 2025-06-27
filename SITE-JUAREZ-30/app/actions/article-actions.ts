"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import slugify from "slugify"

const prisma = new PrismaClient()

// Helper to generate a unique slug
async function generateUniqueSlug(title: string, initialSlug?: string): Promise<string> {
  const baseSlug = initialSlug || slugify(title, { lower: true, strict: true })
  let slug = baseSlug
  let counter = 1
  while (true) {
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })
    if (!existingArticle) {
      return slug
    }
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function createArticle(formData: FormData) {
  const titulo = formData.get("titulo") as string
  const conteudo = formData.get("conteudo") as string
  const customSlug = formData.get("slug") as string

  const slug = await generateUniqueSlug(titulo, customSlug || undefined)

  await prisma.article.create({
    data: {
      titulo,
      slug,
      conteudo,
    },
  })

  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function updateArticle(id: string, formData: FormData) {
  const titulo = formData.get("titulo") as string
  const conteudo = formData.get("conteudo") as string
  const customSlug = formData.get("slug") as string

  // If custom slug is provided and different from current, or if title changed, regenerate slug
  const currentArticle = await prisma.article.findUnique({ where: { id } })
  let slug = currentArticle?.slug || ""
  if (customSlug && customSlug !== currentArticle?.slug) {
    slug = await generateUniqueSlug(titulo, customSlug)
  } else if (titulo !== currentArticle?.titulo) {
    slug = await generateUniqueSlug(titulo)
  }

  await prisma.article.update({
    where: { id },
    data: {
      titulo,
      slug,
      conteudo,
    },
  })

  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({
    where: { id },
  })

  revalidatePath("/admin/blog")
}
