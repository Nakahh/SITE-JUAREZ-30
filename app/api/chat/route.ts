import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Simulação de processamento de IA mais elaborada
    const responses = getContextualResponse(message.toLowerCase(), context, history)

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    return NextResponse.json({
      message: responses,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Erro no chat API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function getContextualResponse(message: string, context?: string, history?: any[]): string {
  // Respostas sobre imóveis
  if (message.includes('imov') || message.includes('casa') || message.includes('apartamento') || message.includes('terreno')) {
    const imovelResponses = [
      '🏠 Temos uma excelente seleção de imóveis em Siqueira Campos! Você está procurando:\n\n• Casa\n• Apartamento\n• Terreno\n• Chácara\n\nQual tipo desperta seu interesse?',
      '🏘️ Perfeito! Trabalhamos com imóveis para venda e locação. Nosso portfólio inclui:\n\n✨ Casas de alto padrão\n🏢 Apartamentos modernos\n🌿 Terrenos em ótimas localizações\n🏡 Chácaras para lazer\n\nQue tipo você prefere?',
      '🎯 Ótima escolha! Em Siqueira Campos temos imóveis incríveis. Para te ajudar melhor, me conte:\n\n• Qual seu orçamento?\n• Quantos quartos precisa?\n• Prefere que região da cidade?\n\nVamos encontrar seu imóvel ideal!'
    ]
    return imovelResponses[Math.floor(Math.random() * imovelResponses.length)]
  }

  // Respostas sobre financiamento
  if (message.includes('financ') || message.includes('financi') || message.includes('emprest') || message.includes('parcel')) {
    return '💰 Oferecemos as melhores condições de financiamento! Trabalhamos com:\n\n🏦 Caixa Econômica Federal\n🏛️ Banco do Brasil\n🏢 Santander\n🏦 Itaú\n\n📊 Use nosso simulador de financiamento para calcular as parcelas: /simulador-financiamento\n\nPosso agendar uma consultoria gratuita para você!'
  }

  // Respostas sobre visitas
  if (message.includes('visit') || message.includes('conhecer') || message.includes('ver') || message.includes('agendar')) {
    return '📅 Ficaria feliz em agendar uma visita! Nossos corretores especializados podem te mostrar os imóveis pessoalmente.\n\n🕐 Horários disponíveis:\n• Segunda a Sexta: 8h às 18h\n• Sábados: 8h às 12h\n\n📱 WhatsApp: (62) 98556-3905\n\nQual horário seria melhor para você?'
  }

  // Respostas sobre contato
  if (message.includes('contato') || message.includes('telefone') || message.includes('whatsapp') || message.includes('falar')) {
    return '📞 Entre em contato conosco:\n\n📱 WhatsApp: (62) 98556-3905\n📧 Email: siqueiraecamposimoveis@gmail.com\n📍 Endereço: Siqueira Campos - GO\n\n🕐 Atendimento:\n• Segunda a Sexta: 8h às 18h\n• Sábados: 8h às 12h\n\nEstamos sempre prontos para ajudar!'
  }

  // Respostas sobre valores/preços
  if (message.includes('valor') || message.includes('preço') || message.includes('custo') || message.includes('quanto')) {
    return '💵 Os valores variam conforme localização, tipo e características do imóvel.\n\n📊 Nossas faixas de preço:\n• Terrenos: R$ 50mil - R$ 200mil\n• Casas: R$ 150mil - R$ 800mil\n• Apartamentos: R$ 120mil - R$ 400mil\n\n🏷️ Temos opções para todos os orçamentos! Que valor você tem em mente?'
  }

  // Respostas sobre localização
  if (message.includes('onde') || message.includes('localiz') || message.includes('região') || message.includes('bairro')) {
    return '📍 Atuamos em toda Siqueira Campos e região! Nossos imóveis estão nas melhores localizações:\n\n🏘️ Centro da cidade\n🌳 Bairros residenciais\n🏞️ Áreas rurais\n🌿 Próximo à natureza\n\nQual região você prefere? Posso mostrar os imóveis disponíveis!'
  }

  // Respostas sobre documentação
  if (message.includes('document') || message.includes('papel') || message.includes('certidão') || message.includes('escrit')) {
    return '📋 Cuidamos de toda documentação para você!\n\n✅ Verificamos:\n• Escrituras\n• Certidões negativas\n• Regularização fiscal\n• Documentos do imóvel\n\n👨‍💼 Nossa equipe jurídica garante segurança total na compra. Você pode ficar tranquilo!'
  }

  // Respostas sobre equipe/corretores
  if (message.includes('corretor') || message.includes('equipe') || message.includes('vendedor') || message.includes('atendente')) {
    return '👥 Nossa equipe é altamente qualificada!\n\n🏆 Corretores experientes\n📚 Sempre atualizados no mercado\n💼 Atendimento personalizado\n🤝 Compromisso com seus sonhos\n\nConheça nossa equipe em: /corretores\n\nQuer falar com um corretor específico?'
  }

  // Respostas sobre avaliação
  if (message.includes('avali') || message.includes('vender') || message.includes('venda') || message.includes('meu imóvel')) {
    return '🏡 Quer vender seu imóvel? Fazemos avaliação gratuita!\n\n📈 Nosso processo:\n• Avaliação técnica gratuita\n• Análise de mercado\n• Estratégia de venda\n• Marketing profissional\n\n📱 Entre em contato: (62) 98556-3905\n\nVamos valorizar seu patrimônio!'
  }

  // Respostas sobre blog/dicas
  if (message.includes('blog') || message.includes('dica') || message.includes('conselho') || message.includes('artigo')) {
    return '📝 Nosso blog tem muito conteúdo útil!\n\n📖 Encontre dicas sobre:\n• Como comprar seu primeiro imóvel\n• Dicas de decoração\n• Mercado imobiliário\n• Financiamentos\n\nAcesse: /blog\n\nQue assunto te interessa mais?'
  }

  // Saudações
  if (message.includes('oi') || message.includes('olá') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
    const saudacoes = [
      '👋 Olá! Seja muito bem-vindo(a) à Siqueira Campos Imóveis! Como posso ajudá-lo(a) hoje?',
      '😊 Oi, tudo bem? Sou o assistente virtual da Siqueira Campos Imóveis. Como posso te ajudar?',
      '🌟 Olá! É um prazer falar com você. Em que posso ser útil hoje?'
    ]
    return saudacoes[Math.floor(Math.random() * saudacoes.length)]
  }

  // Agradecimentos
  if (message.includes('obrigad') || message.includes('valeu') || message.includes('brigadão')) {
    return '😊 Por nada! Fico feliz em ajudar. Se precisar de mais alguma coisa, estarei aqui!\n\n🏠 Lembre-se: na Siqueira Campos Imóveis seu sonho da casa própria se realiza!\n\n📱 WhatsApp: (62) 98556-3905'
  }

  // Despedidas
  if (message.includes('tchau') || message.includes('até logo') || message.includes('obrigado') || message.includes('bye')) {
    return '👋 Até logo! Foi um prazer conversar com você.\n\n🏠 Quando quiser encontrar seu imóvel dos sonhos, estaremos aqui!\n\n📱 WhatsApp: (62) 98556-3905\n🌟 Siqueira Campos Imóveis - Realizando sonhos!'
  }

  // Resposta padrão mais elaborada
  const respostasDefault = [
    '🤔 Interessante pergunta! Embora eu seja especializado em imóveis, vou fazer o possível para ajudar.\n\n🏠 Sobre imóveis, posso ajudar com:\n• Busca de propriedades\n• Informações sobre financiamento\n• Agendamento de visitas\n• Avaliação de imóveis\n\nComo posso te ajudar melhor?',
    '💭 Entendi sua pergunta! Para te dar a melhor resposta, que tal falarmos sobre imóveis?\n\n✨ Posso ajudar você a:\n• Encontrar o imóvel ideal\n• Calcular financiamentos\n• Agendar visitas\n• Esclarecer dúvidas\n\nO que você gostaria de saber?',
    '🎯 Vou fazer o possível para te ajudar! Como especialista em imóveis da Siqueira Campos, posso te auxiliar com:\n\n🏡 Compra e venda de imóveis\n💰 Financiamentos\n📅 Agendamentos\n📋 Documentação\n\nQual seu interesse principal?'
  ]

  return respostasDefault[Math.floor(Math.random() * respostasDefault.length)]
}