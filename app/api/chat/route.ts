
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CHAT_RESPONSES = {
  greeting: [
    "Olá! Como posso ajudá-lo hoje? 😊",
    "Oi! Estou aqui para ajudar com seus imóveis! 🏠",
    "Bem-vindo! O que você gostaria de saber? 👋"
  ],
  properties: [
    "Temos diversos imóveis disponíveis! Você tem alguma preferência de localização ou tipo?",
    "Que tipo de imóvel você está procurando? Casa, apartamento, terreno?",
    "Em qual região você gostaria de morar? Posso mostrar as melhores opções!"
  ],
  financing: [
    "Nosso simulador de financiamento pode ajudar! Qual valor você tem em mente?",
    "Posso te ajudar a entender as opções de financiamento. Quer usar nosso simulador?",
    "Temos parcerias com os melhores bancos. Vamos simular um financiamento?"
  ],
  visit: [
    "Que ótimo! Para qual imóvel você gostaria de agendar uma visita?",
    "Vou te conectar com nosso corretor para agendar sua visita!",
    "Posso agendar uma visita para você. Qual dia seria melhor?"
  ],
  contact: [
    "Vou conectar você com um de nossos corretores especializados!",
    "Nosso WhatsApp: (62) 9 8556-3905. Também pode falar aqui mesmo!",
    "Quer falar com um corretor agora? Posso transferir a conversa!"
  ]
}

interface ChatContext {
  lastMessages: string[]
  userPreferences: any
  currentFlow?: string
}

function analyzeMessage(message: string): { intent: string; confidence: number; entities: any } {
  const lowerMessage = message.toLowerCase()
  
  // Intenções de saudação
  if (/(oi|olá|ola|hello|hi|bom dia|boa tarde|boa noite)/i.test(lowerMessage)) {
    return { intent: 'greeting', confidence: 0.9, entities: {} }
  }
  
  // Intenções sobre imóveis
  if (/(imov|casa|apartamento|terreno|comprar|alugar|venda|locação)/i.test(lowerMessage)) {
    return { intent: 'properties', confidence: 0.8, entities: { type: extractPropertyType(lowerMessage) } }
  }
  
  // Intenções sobre financiamento
  if (/(financiamento|financiar|empréstimo|banco|prestação|entrada)/i.test(lowerMessage)) {
    return { intent: 'financing', confidence: 0.85, entities: {} }
  }
  
  // Intenções sobre visita
  if (/(visita|visitar|agendar|conhecer|ver)/i.test(lowerMessage)) {
    return { intent: 'visit', confidence: 0.8, entities: {} }
  }
  
  // Intenções de contato
  if (/(corretor|atendente|humano|pessoa|telefone|whatsapp)/i.test(lowerMessage)) {
    return { intent: 'contact', confidence: 0.9, entities: {} }
  }
  
  return { intent: 'unknown', confidence: 0.5, entities: {} }
}

function extractPropertyType(message: string): string | null {
  if (/casa/i.test(message)) return 'casa'
  if (/apartamento/i.test(message)) return 'apartamento'
  if (/terreno/i.test(message)) return 'terreno'
  return null
}

async function getPropertiesSuggestions(type?: string) {
  const where = type ? { type: { contains: type, mode: 'insensitive' } } : {}
  
  const properties = await prisma.property.findMany({
    where: {
      status: 'FOR_SALE',
      ...where
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      price: true,
      city: true,
      type: true
    }
  })
  
  return properties
}

function generateResponse(intent: string, entities: any, context?: ChatContext): string {
  const responses = CHAT_RESPONSES[intent as keyof typeof CHAT_RESPONSES] || [
    "Interessante! Pode me dar mais detalhes sobre o que você está procurando?",
    "Entendi! Como posso ajudar você da melhor forma?",
    "Vou verificar isso para você. Um momento!"
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem inválida' },
        { status: 400 }
      )
    }

    // Analisar a mensagem
    const analysis = analyzeMessage(message)
    
    // Gerar resposta baseada na análise
    let responseText = generateResponse(analysis.intent, analysis.entities)
    let responseData: any = { type: 'text' }

    // Buscar dados específicos baseado na intenção
    switch (analysis.intent) {
      case 'properties':
        const properties = await getPropertiesSuggestions(analysis.entities.type)
        if (properties.length > 0) {
          responseText += "\n\nAqui estão alguns imóveis que podem te interessar:\n"
          properties.forEach(prop => {
            responseText += `• ${prop.title} - R$ ${prop.price.toLocaleString('pt-BR')} (${prop.city})\n`
          })
          responseText += "\nQuer saber mais sobre algum deles?"
          responseData = { type: 'properties', data: properties }
        }
        break
        
      case 'financing':
        responseText += "\n\n💡 Dica: Use nosso simulador em /simulador-financiamento"
        responseData = { type: 'suggestion', data: { link: '/simulador-financiamento' } }
        break
        
      case 'visit':
        responseText += "\n\n📅 Você pode agendar visitando a página do imóvel ou falando com nosso corretor!"
        responseData = { type: 'suggestion', data: { action: 'schedule_visit' } }
        break
        
      case 'contact':
        responseText += "\n\n📱 WhatsApp: (62) 9 8556-3905\n📧 Email: siqueiraecamposimoveis@gmail.com"
        responseData = { type: 'contact', data: { 
          whatsapp: '5562985563905',
          email: 'siqueiraecamposimoveis@gmail.com'
        }}
        break
    }

    // Log da conversa (opcional)
    try {
      await prisma.chatMessage.create({
        data: {
          message,
          response: responseText,
          intent: analysis.intent,
          confidence: analysis.confidence,
          createdAt: new Date()
        }
      })
    } catch (error) {
      console.log('Erro ao salvar chat:', error)
    }

    return NextResponse.json({
      message: responseText,
      intent: analysis.intent,
      confidence: analysis.confidence,
      ...responseData
    })

  } catch (error) {
    console.error('Erro no chat API:', error)
    return NextResponse.json(
      { 
        message: "Ops! Tive um problema técnico. Tente novamente ou fale com nosso atendimento pelo WhatsApp: (62) 9 8556-3905",
        error: 'Erro interno do servidor'
      },
      { status: 500 }
    )
  }
}
