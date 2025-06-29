
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, MessageCircle, X, Minimize2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatInterfaceProps {
  isMinimized?: boolean
  onToggleMinimize?: () => void
  onClose?: () => void
  className?: string
}

export default function ChatInterface({ 
  isMinimized = false, 
  onToggleMinimize,
  onClose,
  className 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '👋 Olá! Sou o assistente virtual da Siqueira Campos Imóveis. Como posso ajudá-lo hoje?\n\n🏠 Posso ajudar você a:\n• Encontrar imóveis\n• Agendar visitas\n• Calcular financiamentos\n• Tirar dúvidas sobre nossos serviços',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          context: 'property_consultation',
          history: messages.slice(-5).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Falha na comunicação com o servidor')
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || 'Desculpe, não consegui processar sua mensagem. Tente novamente.',
        isUser: false,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '❌ Desculpe, ocorreu um erro temporário. Tente novamente em alguns instantes ou entre em contato pelo WhatsApp: (62) 98556-3905',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isMinimized) {
    return (
      <Button
        onClick={onToggleMinimize}
        className={cn(
          "fixed z-50 rounded-full shadow-xl transition-all duration-300 hover:scale-110",
          "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90",
          "text-primary-foreground border-2 border-white/20",
          isMobile ? "bottom-4 right-4 w-14 h-14" : "bottom-6 right-6 w-16 h-16"
        )}
      >
        <MessageCircle className={cn("text-white", isMobile ? "w-6 h-6" : "w-7 h-7")} />
      </Button>
    )
  }

  const chatClasses = cn(
    "fixed z-50 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-xl",
    "transition-all duration-300 ease-in-out",
    isMobile 
      ? "inset-0 w-full h-full rounded-none" 
      : "bottom-4 right-4 w-96 h-[600px] rounded-xl",
    "flex flex-col overflow-hidden",
    className
  )

  return (
    <Card className={chatClasses}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistente Siqueira Campos</h3>
            <p className="text-xs opacity-90">Online agora</p>
          </div>
        </div>
        <div className="flex gap-1">
          {onToggleMinimize && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="text-white hover:bg-white/20 p-2 h-auto"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-full",
                message.isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                  message.isUser
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-muted-foreground rounded-bl-md',
                  "shadow-sm border border-border/50"
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={cn(
                    "text-xs mt-2 opacity-70",
                    message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                  )}
                >
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-bl-md shadow-sm border border-border/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Digitando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-background/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 bg-background border-border/50 focus:border-primary transition-colors"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="px-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Powered by <span className="text-primary font-semibold">KRYONIX</span> Development
        </div>
      </div>
    </Card>
  )
}
