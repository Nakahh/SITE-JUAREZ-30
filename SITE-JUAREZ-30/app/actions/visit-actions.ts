"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sendEmail, getVisitConfirmationEmailHtml } from "@/lib/email"

export async function scheduleVisit(formData: FormData) {
  const propertyId = formData.get("propertyId") as string
  const clientName = formData.get("clientName") as string
  const clientEmail = formData.get("clientEmail") as string
  const clientPhone = formData.get("clientPhone") as string
  const dataHora = new Date(formData.get("dataHora") as string)

  // Tenta encontrar o cliente existente ou cria um novo
  let client = await prisma.client.findUnique({
    where: { email: clientEmail },
  })

  if (!client) {
    client = await prisma.client.create({
      data: {
        nome: clientName,
        email: clientEmail,
        telefone: clientPhone,
      },
    })
  } else {
    // Atualiza o nome e telefone se o cliente já existe e os dados são fornecidos
    await prisma.client.update({
      where: { id: client.id },
      data: {
        nome: clientName,
        telefone: clientPhone,
      },
    })
  }

  const newVisit = await prisma.visit.create({
    data: {
      propertyId,
      clientId: client.id, // Usa o ID do cliente encontrado ou criado
      dataHora,
      status: "Pendente",
    },
  })

  // Buscar detalhes do imóvel para o e-mail
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { titulo: true },
  })

  if (property) {
    const propertyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/imoveis/${propertyId}`
    const formattedDateTime = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(dataHora)

    await sendEmail({
      to: clientEmail,
      subject: `Confirmação de Visita Agendada - ${property.titulo}`,
      html: getVisitConfirmationEmailHtml(clientName, property.titulo, formattedDateTime, propertyLink),
    })
  }

  revalidatePath(`/imoveis/${propertyId}`)
  revalidatePath("/admin/visitas")
  return { success: true, message: "Visita agendada com sucesso!" }
}

export async function updateVisit(id: string, formData: FormData) {
  const propertyId = formData.get("propertyId") as string
  const clientId = formData.get("clientId") as string
  const dataHora = new Date(formData.get("dataHora") as string)
  const status = formData.get("status") as string

  await prisma.visit.update({
    where: { id },
    data: {
      propertyId,
      clientId,
      dataHora,
      status,
    },
  })

  revalidatePath("/admin/visitas")
  redirect("/admin/visitas")
}

export async function deleteVisit(id: string) {
  await prisma.visit.delete({
    where: { id },
  })

  revalidatePath("/admin/visitas")
}
