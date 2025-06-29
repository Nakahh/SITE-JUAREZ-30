
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  typing?: boolean
}

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Sou a assistente virtual da Siqueira Campos Imóveis. Como posso ajudá-lo hoje? 😊",
      sender: "bot",
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simular resposta da IA
    setTimeout(() => {
      const botResponse = generateBotResponse(newMessage)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot", 
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes("imovel") || input.includes("casa") || input.includes("apartamento")) {
      return "Temos diversos imóveis disponíveis! Você está procurando casa ou apartamento? Em qual região de Goiânia? Posso ajudá-lo a encontrar opções que se encaixem no seu perfil e orçamento. 🏠"
    }
    
    if (input.includes("preço") || input.includes("valor") || input.includes("custo")) {
      return "Os valores variam conforme localização, tamanho e características do imóvel. Você tem um orçamento em mente? Posso mostrar opções dentro da sua faixa de preço. Para informações detalhadas, você também pode falar diretamente com nossos corretores! 💰"
    }
    
    if (input.includes("financiamento") || input.includes("financiar")) {
      return "Trabalhamos com as melhores linhas de financiamento do mercado! Você pode usar nosso simulador online ou agendar uma consulta com nossa equipe especializada. Precisamos de alguns dados para encontrar a melhor opção para você. 📊"
    }
    
    if (input.includes("visita") || input.includes("visitar") || input.includes("agendar")) {
      return "Posso ajudá-lo a agendar uma visita! Você já tem algum imóvel em mente ou gostaria que eu sugira alguns baseado no seu perfil? Nossos corretores estão disponíveis de segunda a sábado. 📅"
    }
    
    if (input.includes("documentos") || input.includes("documentação")) {
      return "Para a compra de um imóvel você precisará de: RG, CPF, comprovante de renda, comprovante de residência e certidões negativas. Se for financiamento, alguns documentos adicionais podem ser necessários. Quer que eu envie uma lista completa? 📄"
    }
    
    if (input.includes("localização") || input.includes("bairro") || input.includes("região")) {
      return "Atendemos toda Goiânia e região metropolitana! Temos imóveis em diversos bairros como Setor Oeste, Jardins, Bueno, Centro, entre outros. Qual região você tem preferência? 📍"
    }
    
    if (input.includes("corretor") || input.includes("atendimento") || input.includes("humano")) {
      return "Claro! Vou conectá-lo com um de nossos corretores especializados. Você pode entrar em contato pelo WhatsApp (62) 9 8556-3905 ou aguardar que um corretor entre em contato. Em qual tipo de imóvel você tem interesse? 👨‍💼"
    }
    
    if (input.includes("obrigad") || input.includes("thanks") || input.includes("valeu")) {
      return "Por nada! Foi um prazer ajudá-lo. Se precisar de mais alguma coisa, estarei aqui. Boa sorte na busca pelo seu imóvel dos sonhos! 😊🏡"
    }
    
    if (input.includes("oi") || input.includes("olá") || input.includes("hello")) {
      return "Olá! Bem-vindo à Siqueira Campos Imóveis! Como posso ajudá-lo hoje? Está procurando um imóvel específico? 👋"
    }

    // Resposta padrão
    return "Entendi! Para te ajudar melhor, você pode me contar mais detalhes sobre o que está procurando? Ou se preferir, posso conectá-lo diretamente com um de nossos corretores especializados pelo WhatsApp (62) 9 8556-3905. 🤔"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        {/* Indicador de mensagens não lidas */}
        <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">1</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300",
      isMinimized ? "h-14" : "h-96 w-80"
    )}>
      <Card className="h-full shadow-2xl border-0 overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white",
                  isOnline ? "bg-green-500" : "bg-gray-500"
                )} />
              </div>
              <div>
                <CardTitle className="text-sm">Chat Inteligente</CardTitle>
                <p className="text-xs opacity-90">
                  {isOnline ? "Online agora" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-64 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] p-3 rounded-lg text-sm",
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-800 rounded-bl-none"
                      )}
                    >
                      <p>{message.content}</p>
                      <p className={cn(
                        "text-xs mt-1 opacity-70",
                        message.sender === "user" ? "text-blue-100" : "text-muted-foreground"
                      )}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                  disabled={!isOnline}
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !isOnline}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-blue-50"
                  onClick={() => setNewMessage("Quero ver imóveis disponíveis")}
                >
                  Ver Imóveis
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-blue-50"
                  onClick={() => setNewMessage("Quero simular financiamento")}
                >
                  Financiamento
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-blue-50"
                  onClick={() => setNewMessage("Preciso falar com um corretor")}
                >
                  Falar com Corretor
                </Badge>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
