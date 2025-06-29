
import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { prisma } from '@/lib/prisma'

// Configurar OpenAI com GPT-4o (modelo mais avançado)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Sistema de contexto inteligente para o chatbot
const SYSTEM_CONTEXT = `
Você é um assistente especializado em imóveis da Siqueira Campos Imóveis. 

SUAS RESPONSABILIDADES:
- Ajudar clientes a encontrar imóveis ideais
- Fornecer informações sobre propriedades disponíveis
- Agendar visitas
- Explicar processos de compra e aluguel
- Calcular financiamentos
- Dar dicas sobre mercado imobiliário

DIRETRIZES:
- Seja sempre cordial e profissional
- Use linguagem clara e acessível
- Faça perguntas para entender melhor as necessidades
- Ofereça soluções práticas
- Sempre que possível, direcione para contato direto com corretores
- Mantenha o foco em imóveis e serviços da empresa

INFORMAÇÕES DA EMPRESA:
- Empresa: Siqueira Campos Imóveis
- WhatsApp: (62) 98556-3905
- Especializada em imóveis residenciais e comerciais
- Atua em Goiânia e região metropolitana
- Oferece serviços completos de compra, venda e locação

Responda sempre em português brasileiro de forma amigável e útil.
`

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationId } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Buscar propriedades para contexto da IA
    const properties = await prisma.property.findMany({
      where: {
        status: 'AVAILABLE'
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        type: true,
        price: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        city: true,
        address: true
      }
    })

    // Contexto dinâmico com propriedades disponíveis
    const propertiesContext = properties.length > 0 
      ? `\n\nPROPRIEDADES DISPONÍVEIS RECENTES:\n${properties.map(p => 
          `- ${p.title} (${p.type}) - R$ ${p.price.toLocaleString('pt-BR')} - ${p.bedrooms} quartos, ${p.bathrooms} banheiros, ${p.area}m² - ${p.city}`
        ).join('\n')}`
      : ''

    // Preparar mensagens para a IA
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: SYSTEM_CONTEXT + propertiesContext
      },
      {
        role: 'user',
        content: message
      }
    ]

    // Chamar GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Modelo mais avançado
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
      stream: false,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'

    // Salvar conversa no banco de dados para melhorar contexto futuro
    if (userId && conversationId) {
      try {
        await prisma.activityLog.create({
          data: {
            userId,
            action: 'CHAT_MESSAGE',
            details: JSON.stringify({
              conversationId,
              userMessage: message,
              aiResponse: aiResponse.substring(0, 500) // Limitar para não sobrecarregar
            })
          }
        })
      } catch (error) {
        console.error('Erro ao salvar conversa:', error)
      }
    }

    // Detectar intenções especiais para ações
    const intent = detectIntent(message.toLowerCase())
    const actions = generateActions(intent, message)

    return NextResponse.json({
      response: aiResponse,
      intent,
      actions,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro no chat:', error)
    
    // Resposta de fallback mais inteligente
    const fallbackResponse = generateFallbackResponse(message)
    
    return NextResponse.json({
      response: fallbackResponse,
      error: true,
      timestamp: new Date().toISOString()
    })
  }
}

// Detector de intenções melhorado
function detectIntent(message: string): string {
  const intents = {
    'search_property': ['buscar', 'procurar', 'quero', 'imóvel', 'casa', 'apartamento'],
    'schedule_visit': ['visita', 'agendar', 'ver', 'conhecer'],
    'financing': ['financiamento', 'financiar', 'financiado', 'banco'],
    'price_info': ['preço', 'valor', 'custa', 'quanto'],
    'contact': ['contato', 'telefone', 'whatsapp', 'falar'],
    'location': ['onde', 'localização', 'endereço', 'bairro']
  }

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return intent
    }
  }

  return 'general'
}

// Gerador de ações baseado na intenção
function generateActions(intent: string, message: string) {
  const actions = []

  switch (intent) {
    case 'search_property':
      actions.push({
        type: 'link',
        label: 'Ver Imóveis Disponíveis',
        url: '/imoveis'
      })
      break
    
    case 'schedule_visit':
      actions.push({
        type: 'link',
        label: 'Agendar Visita',
        url: '/contato'
      })
      break
    
    case 'financing':
      actions.push({
        type: 'link',
        label: 'Simular Financiamento',
        url: '/simulador-financiamento'
      })
      break
    
    case 'contact':
      actions.push({
        type: 'whatsapp',
        label: 'Falar no WhatsApp',
        number: '5562985563905'
      })
      break
  }

  return actions
}

// Sistema de resposta de fallback inteligente
function generateFallbackResponse(message: string): string {
  const fallbacks = [
    "Desculpe, estou com dificuldades técnicas no momento. Mas posso te ajudar! Entre em contato pelo WhatsApp (62) 98556-3905 para falar diretamente com nossos corretores.",
    "Ops! Algo deu errado, mas não se preocupe. Nossa equipe está sempre disponível pelo WhatsApp (62) 98556-3905 para te atender da melhor forma.",
    "Parece que houve um problema técnico. Enquanto isso, que tal dar uma olhada nos nossos imóveis disponíveis? Ou entre em contato pelo WhatsApp (62) 98556-3905!"
  ]

  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}
