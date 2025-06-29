"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

export async function createSavedSearch(data: {
  title: string
  filters: any
  alertsEnabled: boolean
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado')
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        ...data,
        userId: session.user.id,
      }
    })

    revalidatePath('/dashboard/buscas-salvas')
    return { success: true, data: savedSearch }
  } catch (error) {
    console.error('Erro ao criar busca salva:', error)
    return { success: false, error: 'Erro ao criar busca salva' }
  }
}

export async function deleteSavedSearch(id: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado')
    }

    await prisma.savedSearch.delete({
      where: {
        id,
        userId: session.user.id
      }
    })

    revalidatePath('/dashboard/buscas-salvas')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar busca salva:', error)
    return { success: false, error: 'Erro ao deletar busca salva' }
  }
}

// Função para simular o envio de notificações (pode ser chamada por um cron job)
export async function checkAndNotifySavedSearches() {
  const savedSearches = await prisma.savedSearch.findMany({
    include: { user: true },
  })

  for (const savedSearch of savedSearches) {
    const { filters, user, lastNotifiedAt } = savedSearch
    const searchParams = filters;

    // Converte os parâmetros de busca para o formato esperado pela função de busca de imóveis
    const where: any = {}
    if (searchParams.search) {
      where.OR = [
        { titulo: { contains: searchParams.search, mode: "insensitive" } },
        { localizacao: { contains: searchParams.search, mode: "insensitive" } },
        { descricao: { contains: searchParams.search, mode: "insensitive" } },
      ]
    }
    if (searchParams.tipo) {
      where.tipo = searchParams.tipo
    }
    if (searchParams.minPreco) {
      where.preco = { ...where.preco, gte: Number.parseFloat(searchParams.minPreco) }
    }
    if (searchParams.maxPreco) {
      where.preco = { ...where.preco, lte: Number.parseFloat(searchParams.maxPreco) }
    }
    if (searchParams.quartos) {
      where.quartos = Number.parseInt(searchParams.quartos)
    }
    if (searchParams.minArea) {
      where.area = { ...where.area, gte: Number.parseFloat(searchParams.minArea) }
    }
    if (searchParams.comodidades) {
      const comodidadesArray = (searchParams.comodidades as string)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
      if (comodidadesArray.length > 0) {
        where.comodidades = {
          hasEvery: comodidadesArray,
        }
      }
    }

    // Busca imóveis criados APÓS a última notificação para esta busca salva
    if (lastNotifiedAt) {
      where.createdAt = { gt: lastNotifiedAt }
    }

    const newProperties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    if (newProperties.length > 0) {
      console.log(
        `Encontrados ${newProperties.length} novos imóveis para a busca salva de ${user.email}. Enviando notificação...`,
      )
      // Aqui você chamaria a função de envio de e-mail
      // await sendPropertyAlertEmail(user.email, user.nome || "Cliente", newProperties, searchParams);

      // Atualiza lastNotifiedAt para evitar notificações duplicadas
      await prisma.savedSearch.update({
        where: { id: savedSearch.id },
        data: { lastNotifiedAt: new Date() },
      })
    }
  }
  return { success: true, message: "Verificação de buscas salvas concluída." }
}