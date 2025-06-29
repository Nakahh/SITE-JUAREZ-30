
"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { logActivity } from "@/lib/logger"

const prisma = new PrismaClient()

export async function createCommission(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Usuário não autenticado" }
  }

  try {
    const propertyId = formData.get("propertyId") as string
    const agentId = formData.get("agentId") as string
    const saleValue = parseFloat(formData.get("saleValue") as string)
    const commissionPercentage = parseFloat(formData.get("commissionPercentage") as string)
    const commissionValue = (saleValue * commissionPercentage) / 100
    const type = formData.get("type") as "SALE" | "RENT"
    const status = formData.get("status") as "PENDING" | "PAID" | "CANCELLED"

    const commission = await prisma.commission.create({
      data: {
        propertyId,
        agentId,
        saleValue,
        commissionPercentage,
        commissionValue,
        type,
        status,
        createdBy: session.user.id
      }
    })

    await logActivity(session.user.id, "createCommission", `Comissão criada: R$ ${commissionValue}`)
    revalidatePath("/admin/comissoes")
    
    return { success: true, message: "Comissão criada com sucesso!", commission }
  } catch (error) {
    console.error("Erro ao criar comissão:", error)
    return { success: false, message: "Erro ao criar comissão" }
  }
}

export async function updateCommissionStatus(id: string, status: "PENDING" | "PAID" | "CANCELLED") {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Usuário não autenticado" }
  }

  try {
    const commission = await prisma.commission.update({
      where: { id },
      data: { 
        status,
        paidAt: status === "PAID" ? new Date() : null
      }
    })

    await logActivity(session.user.id, "updateCommissionStatus", `Status da comissão atualizado para: ${status}`)
    revalidatePath("/admin/comissoes")
    
    return { success: true, message: "Status atualizado com sucesso!", commission }
  } catch (error) {
    console.error("Erro ao atualizar status da comissão:", error)
    return { success: false, message: "Erro ao atualizar status" }
  }
}

export async function getCommissionsByAgent(agentId: string) {
  try {
    const commissions = await prisma.commission.findMany({
      where: { agentId },
      include: {
        property: {
          select: {
            title: true,
            address: true
          }
        },
        agent: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return { success: true, commissions }
  } catch (error) {
    console.error("Erro ao buscar comissões do corretor:", error)
    return { success: false, message: "Erro ao buscar comissões" }
  }
}

export async function getCommissionReport(startDate?: Date, endDate?: Date) {
  try {
    const where: any = {}
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      }
    }

    const commissions = await prisma.commission.findMany({
      where,
      include: {
        property: {
          select: {
            title: true,
            address: true,
            type: true
          }
        },
        agent: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commissionValue, 0)
    const paidCommissions = commissions.filter(c => c.status === "PAID").reduce((sum, commission) => sum + commission.commissionValue, 0)
    const pendingCommissions = commissions.filter(c => c.status === "PENDING").reduce((sum, commission) => sum + commission.commissionValue, 0)

    return {
      success: true,
      data: {
        commissions,
        summary: {
          total: totalCommissions,
          paid: paidCommissions,
          pending: pendingCommissions,
          count: commissions.length
        }
      }
    }
  } catch (error) {
    console.error("Erro ao gerar relatório de comissões:", error)
    return { success: false, message: "Erro ao gerar relatório" }
  }
}
