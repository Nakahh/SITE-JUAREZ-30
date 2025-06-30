"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function toggleFavorite(propertyId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const existingFavorite = await prisma.favoriteProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favoriteProperty.delete({
        where: { id: existingFavorite.id },
      });
    } else {
      await prisma.favoriteProperty.create({
        data: {
          userId: session.user.id,
          propertyId,
        },
      });
    }

    revalidatePath("/favoritos");
    revalidatePath("/imoveis");
    return { success: true };
  } catch (error) {
    console.error("Erro ao alterar favorito:", error);
    return { success: false, error: "Erro ao alterar favorito" };
  }
}

export async function getFavorites() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return [];
    }

    const favorites = await prisma.favoriteProperty.findMany({
      where: { userId: session.user.id },
      include: { property: true },
    });

    return favorites;
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }
}
