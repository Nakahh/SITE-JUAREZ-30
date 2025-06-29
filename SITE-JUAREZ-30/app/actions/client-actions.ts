"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createClient(formData: FormData) {
  const nome = formData.get("nome") as string
  const email = formData.get("email") as string
  const telefone = formData.get("telefone") as string

  await prisma.client.create({
    data: {
      nome,
      email,
      telefone,
    },
  })

  revalidatePath("/admin/leads")
  redirect("/admin/leads")
}

export async function updateClient(id: string, formData: FormData) {
  const nome = formData.get("nome") as string
  const email = formData.get("email") as string
  const telefone = formData.get("telefone") as string

  await prisma.client.update({
    where: { id },
    data: {
      nome,
      email,
      telefone,
    },
  })

  revalidatePath("/admin/leads")
  redirect("/admin/leads")
}

export async function deleteClient(id: string) {
  await prisma.client.delete({
    where: { id },
  })

  revalidatePath("/admin/leads")
}
