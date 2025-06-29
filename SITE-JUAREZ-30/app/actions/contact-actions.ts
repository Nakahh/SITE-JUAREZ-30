import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendEmail, getContactConfirmationEmailHtml, getNewLeadNotificationEmailHtml } from "@/lib/email"

export async function createContact(formData: FormData) {
  const nome = formData.get("nome") as string
  const email = formData.get("email") as string
  const telefone = formData.get("telefone") as string
  const mensagem = formData.get("mensagem") as string
  const tipo = formData.get("tipo") as string // Novo campo

  try {
    await prisma.client.create({
      data: {
        nome,
        email,
        telefone,
      },
    })

    // Enviar e-mail de confirmação para o cliente
    await sendEmail({
      to: email,
      subject: "Sua mensagem foi recebida - Imobiliária Siqueira Campos",
      html: getContactConfirmationEmailHtml(nome, email, mensagem),
    })

    // Enviar notificação para o admin (substitua 'admin@example.com' pelo e-mail do seu admin)
    await sendEmail({
      to: process.env.ADMIN_EMAIL_NOTIFICATION || "admin@example.com", // E-mail do administrador
      subject: `Novo Contato: ${tipo} de ${nome}`,
      html: getNewLeadNotificationEmailHtml(nome, email, telefone, mensagem, tipo),
    })

    revalidatePath("/contato")
    return { success: true, message: "Sua mensagem foi enviada com sucesso! Em breve entraremos em contato." }
  } catch (error) {
    console.error("Erro ao criar contato:", error)
    return { success: false, message: "Erro ao enviar mensagem. Tente novamente." }
  }
}
