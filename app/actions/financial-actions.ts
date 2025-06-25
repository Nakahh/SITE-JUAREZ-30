"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function createFinancialRecord(formData: FormData) {
  const descricao = formData.get("descricao") as string
  const valor = Number.parseFloat(formData.get("valor") as string)
  const tipo = formData.get("tipo") as string // "Receita" ou "Despesa"
  const data = new Date(formData.get("data") as string)

  await prisma.financialRecord.create({
    data: {
      descricao,
      valor,
      tipo,
      data,
    },
  })

  revalidatePath("/admin/financeiro")
  redirect("/admin/financeiro")
}

export async function updateFinancialRecord(id: string, formData: FormData) {
  const descricao = formData.get("descricao") as string
  const valor = Number.parseFloat(formData.get("valor") as string)
  const tipo = formData.get("tipo") as string
  const data = new Date(formData.get("data") as string)

  await prisma.financialRecord.update({
    where: { id },
    data: {
      descricao,
      valor,
      tipo,
      data,
    },
  })

  revalidatePath("/admin/financeiro")
  redirect("/admin/financeiro")
}

export async function deleteFinancialRecord(id: string) {
  await prisma.financialRecord.delete({
    where: { id },
  })

  revalidatePath("/admin/financeiro")
}
