"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email" // Importar a função de envio de e-mail

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { success: false, message: "Por favor, forneça um e-mail válido." }
  }

  try {
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    })

    if (existingSubscription) {
      return { success: false, message: "Este e-mail já está inscrito na newsletter." }
    }

    await prisma.newsletterSubscription.create({
      data: { email },
    })

    // Enviar e-mail de confirmação (se RESEND_API_KEY estiver configurada)
    await sendEmail({
      to: email,
      subject: "Confirmação de Inscrição na Newsletter",
      html: `
        <h1>Obrigado por se inscrever!</h1>
        <p>Você foi inscrito com sucesso na nossa newsletter e receberá as últimas novidades sobre imóveis.</p>
        <p>Atenciosamente,<br/>Siqueira Campos Imóveis</p>
      `,
    })

    revalidatePath("/")
    revalidatePath("/admin/newsletter") // Revalidar a página de admin da newsletter
    return { success: true, message: "Inscrição realizada com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao inscrever na newsletter:", error)
    return { success: false, message: "Erro ao inscrever na newsletter. Tente novamente." }
  }
}

export async function deleteNewsletterSubscription(id: string) {
  try {
    await prisma.newsletterSubscription.delete({ where: { id } })
    revalidatePath("/admin/newsletter")
    return { success: true, message: "Inscrição removida com sucesso!" }
  } catch (error) {
    console.error("Erro ao remover inscrição da newsletter:", error)
    return { success: false, message: "Erro ao remover inscrição." }
  }
}
