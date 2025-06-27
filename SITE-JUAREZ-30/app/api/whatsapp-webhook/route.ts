import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"
import { sendWhatsAppMessage } from "@/app/actions/whatsapp-actions"
import { getWhatsappAiStatus } from "@/app/actions/app-settings-actions"

// Importe o PrismaClient para acessar o banco de dados
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  // Verificação de segurança: Opcional, mas recomendado para garantir que a requisição vem da Evolution API
  // Você pode usar um token de verificação ou a chave da API se a Evolution API suportar.
  // Por exemplo, se a Evolution API enviar um header 'x-api-key':
  const evolutionApiKey = req.headers.get("x-api-key") || req.headers.get("apikey")
  if (process.env.EVOLUTION_API_KEY && evolutionApiKey !== process.env.EVOLUTION_API_KEY) {
    console.warn("Tentativa de acesso não autorizado ao webhook do WhatsApp.")
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const payload = await req.json()
    console.log("Webhook do WhatsApp recebido:", JSON.stringify(payload, null, 2))

    // Adapte esta parte para a estrutura exata do payload da sua Evolution API
    // Este é um exemplo comum para mensagens de texto recebidas.
    const messageData = payload.data?.message
    const senderNumber = payload.data?.key?.remoteJid // Número do remetente (ex: 5543999999999@s.whatsapp.net)
    const messageText = messageData?.message?.conversation || messageData?.message?.extendedTextMessage?.text

    if (!senderNumber || !messageText) {
      console.warn("Payload do WhatsApp inválido: número ou texto da mensagem ausente.")
      return NextResponse.json({ message: "Payload inválido" }, { status: 400 })
    }

    // Remove o sufixo "@s.whatsapp.net" para obter apenas o número
    const cleanSenderNumber = senderNumber.split("@")[0]

    // 1. Verificar se a IA está ativada
    const isAiEnabled = await getWhatsappAiStatus()

    if (!isAiEnabled) {
      console.log("IA do WhatsApp desativada. Não processando mensagem.")
      // Opcional: Enviar uma mensagem padrão ou apenas ignorar
      // await sendWhatsAppMessage({ to: cleanSenderNumber, message: "A IA está temporariamente desativada. Por favor, entre em contato com um atendente." });
      return NextResponse.json({ message: "IA desativada" }, { status: 200 })
    }

    // 2. Processar a mensagem com a IA (OpenAI)
    const result = await generateText({
      model: openai("gpt-4o"),
      messages: [{ role: "user", content: messageText }],
      system: `Você é um assistente de imóveis amigável e prestativo da "Siqueira Campos Imóveis" no WhatsApp.
      Sua principal função é ajudar os clientes a encontrar imóveis, responder a perguntas sobre o mercado imobiliário,
      e direcioná-los para as seções corretas do site ou para contato humano quando necessário.
      Seja conciso, mas informativo. Não invente informações sobre imóveis específicos que você não conhece.
      Se o usuário perguntar sobre um imóvel específico, sugira que ele visite a página de imóveis ou entre em contato.
      Seja sempre educado e profissional.`,
    })

    const aiResponse = result.text

    // 3. Enviar a resposta da IA de volta via Evolution API
    const sendResult = await sendWhatsAppMessage({ to: cleanSenderNumber, message: aiResponse })

    if (sendResult.success) {
      console.log(`Resposta da IA enviada para ${cleanSenderNumber}: ${aiResponse}`)
      return NextResponse.json({ message: "Mensagem processada e resposta enviada" }, { status: 200 })
    } else {
      console.error("Erro ao enviar resposta da IA via WhatsApp:", sendResult.message)
      return NextResponse.json({ error: "Erro ao enviar resposta da IA" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro no webhook do WhatsApp:", error)
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 })
  } finally {
    // Garante que a conexão com o Prisma seja fechada
    await prisma.$disconnect()
  }
}
