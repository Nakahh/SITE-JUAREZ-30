import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const result = await generateText({
      model: openai("gpt-4o"), // Usando GPT-4o para respostas mais inteligentes
      messages,
      system: `Você é um assistente de imóveis amigável e prestativo da "Siqueira Campos Imóveis".
      Sua principal função é ajudar os clientes a encontrar imóveis, responder a perguntas sobre o mercado imobiliário,
      e direcioná-los para as seções corretas do site ou para contato humano quando necessário.
      Seja conciso, mas informativo. Não invente informações sobre imóveis específicos que você não conhece.
      Se o usuário perguntar sobre um imóvel específico, sugira que ele visite a página de imóveis ou entre em contato.
      Seja sempre educado e profissional.`,
    })

    return new NextResponse(result.toStream())
  } catch (error) {
    console.error("Erro na API de chat:", error)
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 })
  }
}
