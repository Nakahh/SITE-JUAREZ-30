"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/logger"

const prisma = new PrismaClient()

export interface FinancingResult {
  monthlyPayment: number
  totalAmount: number
  totalInterest: number
  payments: {
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export async function calculateSAC(
  principal: number,
  annualRate: number,
  termMonths: number
): Promise<FinancingResult> {
  const monthlyRate = annualRate / 12 / 100
  const monthlyPrincipal = principal / termMonths
  let balance = principal
  let totalInterest = 0
  const payments = []

  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * monthlyRate
    const payment = monthlyPrincipal + interest
    balance -= monthlyPrincipal
    totalInterest += interest

    payments.push({
      payment: Math.round(payment * 100) / 100,
      principal: Math.round(monthlyPrincipal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100
    })
  }

  return {
    monthlyPayment: Math.round((monthlyPrincipal + (principal * monthlyRate)) * 100) / 100,
    totalAmount: Math.round((principal + totalInterest) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    payments
  }
}

export async function calculatePRICE(
  principal: number,
  annualRate: number,
  termMonths: number
): Promise<FinancingResult> {
  const monthlyRate = annualRate / 12 / 100
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)

  let balance = principal
  let totalInterest = 0
  const payments = []

  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * monthlyRate
    const principalPayment = monthlyPayment - interest
    balance -= principalPayment
    totalInterest += interest

    payments.push({
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(Math.max(0, balance) * 100) / 100
    })
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalAmount: Math.round((monthlyPayment * termMonths) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    payments
  }
}

export async function simulateFinancing(formData: FormData) {
  try {
    const propertyValue = parseFloat(formData.get("propertyValue") as string)
    const downPayment = parseFloat(formData.get("downPayment") as string)
    const interestRate = parseFloat(formData.get("interestRate") as string)
    const termMonths = parseInt(formData.get("termMonths") as string)
    const type = formData.get("type") as "SAC" | "PRICE"

    const financedAmount = propertyValue - downPayment

    if (financedAmount <= 0) {
      return { success: false, message: "Valor do financiamento deve ser positivo" }
    }

    let calculation: FinancingResult

    if (type === "SAC") {
      calculation = await calculateSAC(financedAmount, interestRate, termMonths)
    } else {
      calculation = await calculatePRICE(financedAmount, interestRate, termMonths)
    }

    return {
      success: true,
      data: {
        propertyValue,
        downPayment,
        financedAmount,
        interestRate,
        termMonths,
        type,
        ...calculation
      }
    }
  } catch (error) {
    console.error("Erro ao simular financiamento:", error)
    return { success: false, message: "Erro ao simular financiamento" }
  }
}

export async function createFinancing(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Usuário não autenticado" }
  }

  try {
    const propertyId = formData.get("propertyId") as string
    const clientId = formData.get("clientId") as string || null
    const userId = formData.get("userId") as string || null
    const propertyValue = parseFloat(formData.get("propertyValue") as string)
    const downPayment = parseFloat(formData.get("downPayment") as string)
    const interestRate = parseFloat(formData.get("interestRate") as string)
    const termMonths = parseInt(formData.get("termMonths") as string)
    const type = formData.get("type") as "SAC" | "PRICE"
    const bankName = formData.get("bankName") as string || null
    const observations = formData.get("observations") as string || null

    const financedAmount = propertyValue - downPayment
    let calculation: FinancingResult

    if (type === "SAC") {
      calculation = await calculateSAC(financedAmount, interestRate, termMonths)
    } else {
      calculation = await calculatePRICE(financedAmount, interestRate, termMonths)
    }

    const financing = await prisma.financing.create({
      data: {
        propertyId,
        clientId,
        userId,
        propertyValue,
        downPayment,
        financedAmount,
        interestRate,
        termMonths,
        monthlyPayment: calculation.monthlyPayment,
        totalAmount: calculation.totalAmount,
        type,
        bankName,
        observations
      }
    })

    await logActivity(session.user.id, "createFinancing", `Financiamento criado: ${propertyId}`)
    revalidatePath("/admin/financiamentos")

    return { success: true, message: "Financiamento criado com sucesso!", financing }
  } catch (error) {
    console.error("Erro ao criar financiamento:", error)
    return { success: false, message: "Erro ao criar financiamento" }
  }
}

export async function updateFinancingStatus(id: string, status: "SIMULATING" | "PENDING" | "APPROVED" | "REJECTED" | "CONTRACTED") {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Usuário não autenticado" }
  }

  try {
    const financing = await prisma.financing.update({
      where: { id },
      data: { status }
    })

    await logActivity(session.user.id, "updateFinancingStatus", `Status do financiamento atualizado para: ${status}`)
    revalidatePath("/admin/financiamentos")

    return { success: true, message: "Status atualizado com sucesso!", financing }
  } catch (error) {
    console.error("Erro ao atualizar status do financiamento:", error)
    return { success: false, message: "Erro ao atualizar status" }
  }
}

export async function getFinancingReport(startDate?: Date, endDate?: Date) {
  try {
    const where: any = {}

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      }
    }

    const financings = await prisma.financing.findMany({
      where,
      include: {
        property: {
          select: {
            title: true,
            address: true,
            price: true
          }
        },
        client: {
          select: {
            name: true,
            email: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    const totalFinanced = financings.reduce((sum, financing) => sum + financing.financedAmount, 0)
    const approvedFinancings = financings.filter(f => f.status === "APPROVED")
    const approvedAmount = approvedFinancings.reduce((sum, financing) => sum + financing.financedAmount, 0)

    return {
      success: true,
      data: {
        financings,
        summary: {
          total: totalFinanced,
          approved: approvedAmount,
          count: financings.length,
          approvedCount: approvedFinancings.length
        }
      }
    }
  } catch (error) {
    console.error("Erro ao gerar relatório de financiamentos:", error)
    return { success: false, message: "Erro ao gerar relatório" }
  }
}