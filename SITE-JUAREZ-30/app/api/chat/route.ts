import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Certifique-se de que OPENAI_API_KEY está configurada no seu .env
  // Se não estiver, esta rota pode falhar.
  const result = await streamText({
    model: openai("gpt-4o"), // Usando OpenAI como fallback
    messages,
  })

  return result.toAIStreamResponse()
}
