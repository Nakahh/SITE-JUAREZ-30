"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getWhatsappAiStatus(): Promise<boolean> {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: "whatsapp_ai_enabled" },
    })
    return setting?.value === "true"
  } catch (error) {
    console.error("Erro ao buscar status da IA do WhatsApp:", error)
    return false // Assume desabilitado em caso de erro
  }
}

export async function toggleWhatsappAiStatus(enabled: boolean) {
  try {
    await prisma.appSetting.upsert({
      where: { key: "whatsapp_ai_enabled" },
      update: { value: enabled ? "true" : "false" },
      create: { key: "whatsapp_ai_enabled", value: enabled ? "true" : "false" },
    })
    return { success: true, message: `IA do WhatsApp ${enabled ? "ativada" : "desativada"} com sucesso!` }
  } catch (error) {
    console.error("Erro ao alternar status da IA do WhatsApp:", error)
    return { success: false, message: "Erro ao alternar status da IA do WhatsApp." }
  }
}
