import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `Você é um assistente virtual especializado em imóveis da Siqueira Campos Imóveis.

INFORMAÇÕES DA EMPRESA:
- Nome: Siqueira Campos Imóveis
- Especialidade: Venda e locação de imóveis residenciais e comerciais
- Localização: Atendemos toda a região
- WhatsApp: +55 62 98556-3905
- Desenvolvedor: KRYONIX Development (WhatsApp: +55 17 98180-5327, Instagram: @kryon.ix)

SUAS RESPONSABILIDADES:
1. Ajudar clientes a encontrar imóveis ideais
2. Fornecer informações sobre propriedades disponíveis
3. Agendar visitas
4. Calcular financiamentos
5. Esclarecer dúvidas sobre documentação
6. Conectar com corretores especializados

DIRETRIZES:
- Seja sempre cordial e profissional
- Use informações atualizadas do banco de dados
- Sugira imóveis baseado nas necessidades do cliente
- Ofereça agendamento de visitas
- Forneça simulações de financiamento quando apropriado
- Encaminhe para WhatsApp quando necessário contato direto

TIPOS DE IMÓVEIS:
- Casas residenciais
- Apartamentos
- Terrenos
- Imóveis comerciais
- Chácaras e sítios

Sempre mantenha o foco em ajudar o cliente a encontrar o imóvel perfeito!
`

export async function POST(request: Request) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key não configurada' },
        { status: 500 }
      )
    }

    // Buscar imóveis disponíveis para contexto
    const properties = await prisma.property.findMany({
      where: {
        status: {
          in: ['FOR_SALE', 'FOR_RENT', 'AVAILABLE']
        }
      },
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        agent: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Buscar corretores disponíveis
    const agents = await prisma.user.findMany({
      where: {
        role: 'AGENT'
      },
      select: {
        name: true,
        email: true
      }
    })

    const propertyContext = properties.map(p => 
      `Imóvel ID: ${p.id}
       Título: ${p.title}
       Tipo: ${p.type}
       Preço: R$ ${p.price.toLocaleString('pt-BR')}
       Status: ${p.status}
       Endereço: ${p.address}, ${p.city}
       Quartos: ${p.bedrooms}
       Banheiros: ${p.bathrooms}
       Área: ${p.area}m²
       Descrição: ${p.description}
       Corretor: ${p.agent?.name || 'Não atribuído'}`
    ).join('\n\n')

    const agentContext = agents.map(a => 
      `Corretor: ${a.name} - Email: ${a.email}`
    ).join('\n')

    const messages = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT}

IMÓVEIS DISPONÍVEIS:
${propertyContext}

CORRETORES DISPONÍVEIS:
${agentContext}

Data atual: ${new Date().toLocaleDateString('pt-BR')}
`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      max_tokens: 1000,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    })

    const reply = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'

    // Log da conversa para análise
    await prisma.activityLog.create({
      data: {
        action: 'CHAT_INTERACTION',
        details: `Usuário: ${message} | IA: ${reply.substring(0, 200)}...`
      }
    })

    return NextResponse.json({ 
      reply,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro no chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}