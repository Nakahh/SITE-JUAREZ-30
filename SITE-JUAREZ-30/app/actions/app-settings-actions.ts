"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const WHATSAPP_AI_KEY = "whatsapp_ai_enabled"
export async function getWhatsappAiStatus(): Promise<boolean> {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: WHATSAPP_AI_KEY },
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
      where: { key: WHATSAPP_AI_KEY },
      update: { value: enabled ? "true" : "false" },
      create: { key: WHATSAPP_AI_KEY, value: enabled ? "true" : "false" },
    })
    revalidatePath("/admin/settings") // Exemplo: revalida a página de configurações
    return { success: true, message: `IA do WhatsApp ${enabled ? "ativada" : "desativada"} com sucesso!` }
  } catch (error) {
    console.error("Erro ao alternar status da IA do WhatsApp:", error)
    return { success: false, message: "Erro ao alternar status da IA do WhatsApp." }
  }
}
warn Versions of prisma@5.22.0 and @prisma/client@6.10.1 don't match.
This might lead to unexpected behavior.
