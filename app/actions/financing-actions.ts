
"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { logActivity } from "@/lib/logger"

const prisma = new PrismaClient()

interface FinancingCalculation {
  monthlyPayment: number
  totalAmount: number
  totalInterest: number
  payments: Array<{
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }>
}

export function calculateSAC(
  principal: number,
  annualRate: number,
  termMonths: number
): FinancingCalculation {
  const monthlyRate = annualRate / 12 / 100
  const principalPayment = principal / termMonths
  let balance = principal
  const payments = []
  let totalAmount = 0

  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = balance * monthlyRate
    const monthlyPayment = principalPayment + interestPayment
    balance -= principalPayment
    totalAmount += monthlyPayment

    payments.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance)
    })
  }

  return {
    monthlyPayment: payments[0].payment,
    totalAmount,
    totalInterest: totalAmount - principal,
    payments
  }
}

export function calculatePRICE(
  principal: number,
  annualRate: number,
  termMonths: number
): FinancingCalculation {
  const monthlyRate = annualRate / 12 / 100
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                        (Math.pow(1 + monthlyRate, termMonths) - 1)
  
  let balance = principal
  const payments = []
  let totalAmount = 0

  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    balance -= principalPayment
    totalAmount += monthlyPayment

    payments.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance)
    })
  }

  return {
    monthlyPayment,
    totalAmount,
    totalInterest: totalAmount - principal,
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

    let calculation: FinancingCalculation

    if (type === "SAC") {
      calculation = calculateSAC(financedAmount, interestRate, termMonths)
    } else {
      calculation = calculatePRICE(financedAmount, interestRate, termMonths)
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
    let calculation: FinancingCalculation

    if (type === "SAC") {
      calculation = calculateSAC(financedAmount, interestRate, termMonths)
    } else {
      calculation = calculatePRICE(financedAmount, interestRate, termMonths)
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
