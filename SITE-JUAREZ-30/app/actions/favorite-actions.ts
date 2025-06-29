"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function toggleFavorite(propertyId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return { success: false, message: "Você precisa estar logado para favoritar imóveis." }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return { success: false, message: "Usuário não encontrado." }
  }

  const existingFavorite = await prisma.favoriteProperty.findUnique({
    where: {
      userId_propertyId: {
        userId: user.id,
        propertyId: propertyId,
      },
    },
  })

  if (existingFavorite) {
    // Remove dos favoritos
    await prisma.favoriteProperty.delete({
      where: { id: existingFavorite.id },
    })
    revalidatePath("/favoritos")
    revalidatePath(`/imoveis/${propertyId}`)
    return { success: true, message: "Imóvel removido dos favoritos." }
  } else {
    // Adiciona aos favoritos
    await prisma.favoriteProperty.create({
      data: {
        userId: user.id,
        propertyId: propertyId,
      },
    })
    revalidatePath("/favoritos")
    revalidatePath(`/imoveis/${propertyId}`)
    return { success: true, message: "Imóvel adicionado aos favoritos!" }
  }
}

export async function getFavoriteStatus(propertyId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return false
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return false
  }

  const existingFavorite = await prisma.favoriteProperty.findUnique({
    where: {
      userId_propertyId: {
        userId: user.id,
        propertyId: propertyId,
      },
    },
  })

  return !!existingFavorite
}
