"use server"

interface SendWhatsAppMessageOptions {
  to: string // Número de telefone do destinatário (ex: 5543999999999)
  message: string // Mensagem a ser enviada
}

// Esta é uma função de exemplo para enviar mensagens via uma API externa de WhatsApp.
// Você precisará substituir a URL e a chave da API pela sua Evolution API real.
export async function sendWhatsAppMessage({ to, message }: SendWhatsAppMessageOptions) {
  const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL // Ex: "http://localhost:8080/message/sendText/instanceName"
  const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY // Sua chave de API da Evolution

  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
    console.warn("EVOLUTION_API_URL ou EVOLUTION_API_KEY não configuradas. Mensagem WhatsApp não enviada.")
    return { success: false, message: "Configuração da API WhatsApp ausente." }
  }

  try {
    const response = await fetch(EVOLUTION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: EVOLUTION_API_KEY, // Ou "Authorization": `Bearer ${EVOLUTION_API_KEY}` dependendo da sua API
      },
      body: JSON.stringify({
        number: to,
        textMessage: {
          text: message,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Erro ao enviar mensagem WhatsApp:", data)
      return { success: false, message: `Erro ao enviar mensagem WhatsApp: ${data.message || "Erro desconhecido"}` }
    }

    console.log("Mensagem WhatsApp enviada com sucesso:", data)
    return { success: true, message: "Mensagem WhatsApp enviada com sucesso!" }
  } catch (error) {
    console.error("Erro inesperado ao enviar mensagem WhatsApp:", error)
    return { success: false, message: "Erro inesperado ao enviar mensagem WhatsApp." }
  }
}
