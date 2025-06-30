"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Send,
  Bot,
  User,
  Home,
  Calculator,
  Calendar,
  Phone,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  quickActions?: {
    label: string;
    action: string;
    icon?: any;
  }[];
}

interface EnhancedChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedChatInterface({
  isOpen,
  onClose,
}: EnhancedChatInterfaceProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Olá${session?.user?.name ? `, ${session.user.name}` : ""}! 👋 Sou a assistente virtual da Siqueira Campos Imóveis. Como posso ajudá-lo hoje?`,
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Quero comprar um imóvel",
        "Quero alugar um imóvel",
        "Simular financiamento",
        "Agendar uma visita",
      ],
      quickActions: [
        { label: "Ver Imóveis", action: "/imoveis", icon: Home },
        {
          label: "Simulador",
          action: "/simulador-financiamento",
          icon: Calculator,
        },
        { label: "Contato", action: "contact", icon: Phone },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carregar perfil do usuário se estiver logado
  useEffect(() => {
    if (session?.user) {
      setUserProfile({
        name: session.user.name,
        email: session.user.email,
        isLoggedIn: true,
      });
    }
  }, [session]);

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputValue;
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInputValue("");
    setIsLoading(true);

    // Simular processamento da IA
    setTimeout(() => {
      const botResponse = generateIntelligentResponse(message, userProfile);
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateIntelligentResponse = (
    userInput: string,
    profile: any,
  ): Message => {
    const input = userInput.toLowerCase();
    const isLoggedIn = profile?.isLoggedIn;
    const userName = profile?.name;

    // Respostas inteligentes baseadas no contexto
    if (input.includes("comprar") || input.includes("compra")) {
      return {
        id: (Date.now() + 1).toString(),
        content: `Perfeito${userName ? `, ${userName}` : ""}! Temos uma excelente seleção de imóveis para venda. Que tipo de imóvel você está procurando?`,
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          "Casa até R$ 500.000",
          "Apartamento 2 quartos",
          "Imóveis de luxo",
          "Terrenos para construir",
        ],
        quickActions: [
          { label: "Ver Casas", action: "/imoveis?type=HOUSE", icon: Home },
          {
            label: "Ver Apartamentos",
            action: "/imoveis?type=APARTMENT",
            icon: Home,
          },
          {
            label: "Simular Financiamento",
            action: "/simulador-financiamento",
            icon: Calculator,
          },
        ],
      };
    }

    if (
      input.includes("alugar") ||
      input.includes("aluguel") ||
      input.includes("locar")
    ) {
      return {
        id: (Date.now() + 1).toString(),
        content:
          "Temos ótimas opções para locação! Qual região de Goiânia você prefere e qual seu orçamento mensal?",
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          "Centro de Goiânia",
          "Setor Oeste",
          "Jardim Goiás",
          "Setor Bueno",
        ],
        quickActions: [
          {
            label: "Imóveis para Alugar",
            action: "/imoveis?status=FOR_RENT",
            icon: Home,
          },
        ],
      };
    }

    if (
      input.includes("financiamento") ||
      input.includes("financiar") ||
      input.includes("prestação")
    ) {
      return {
        id: (Date.now() + 1).toString(),
        content:
          "Nosso simulador de financiamento pode te ajudar a calcular as melhores condições! Qual o valor do imóvel que você tem interesse?",
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          "Até R$ 300.000",
          "R$ 300.000 a R$ 500.000",
          "R$ 500.000 a R$ 800.000",
          "Acima de R$ 800.000",
        ],
        quickActions: [
          {
            label: "Usar Simulador",
            action: "/simulador-financiamento",
            icon: Calculator,
          },
        ],
      };
    }

    if (
      input.includes("visita") ||
      input.includes("agendar") ||
      input.includes("ver")
    ) {
      return {
        id: (Date.now() + 1).toString(),
        content: isLoggedIn
          ? "Você pode agendar visitas diretamente nos imóveis que te interessam! Basta clicar no botão 'Agendar Visita' em qualquer propriedade."
          : "Para agendar visitas, você pode fazer login na sua conta ou enviar seus dados. Qual imóvel você gostaria de visitar?",
        sender: "bot",
        timestamp: new Date(),
        quickActions: isLoggedIn
          ? [{ label: "Ver Imóveis", action: "/imoveis", icon: Home }]
          : [
              { label: "Fazer Login", action: "/login", icon: User },
              { label: "Ver Imóveis", action: "/imoveis", icon: Home },
            ],
      };
    }

    if (
      input.includes("preço") ||
      input.includes("valor") ||
      input.includes("quanto")
    ) {
      return {
        id: (Date.now() + 1).toString(),
        content:
          "Nossos preços variam conforme localização, tamanho e características do imóvel. Vou te mostrar algumas faixas populares:",
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          "Até R$ 200.000",
          "R$ 200.000 a R$ 400.000",
          "R$ 400.000 a R$ 600.000",
          "Acima de R$ 600.000",
        ],
        quickActions: [
          { label: "Filtrar por Preço", action: "/imoveis", icon: Home },
        ],
      };
    }

    if (
      input.includes("contato") ||
      input.includes("telefone") ||
      input.includes("whatsapp") ||
      input.includes("corretor")
    ) {
      return {
        id: (Date.now() + 1).toString(),
        content: "Você pode entrar em contato conosco das seguintes formas:",
        sender: "bot",
        timestamp: new Date(),
        quickActions: [
          { label: "WhatsApp", action: "whatsapp", icon: MessageCircle },
          { label: "Telefone", action: "phone", icon: Phone },
          { label: "Página de Contato", action: "/contato", icon: User },
        ],
      };
    }

    if (
      input.includes("localização") ||
      input.includes("região") ||
      input.includes("bairro")
    ) {
      return {
        id: (Date.now() + 1).toString(),
        content:
          "Atendemos toda Goiânia e região metropolitana! Algumas das nossas regiões mais procuradas:",
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          "Centro",
          "Setor Oeste",
          "Jardim Goiás",
          "Setor Sul",
          "Aparecida de Goiânia",
        ],
      };
    }

    // Resposta padrão inteligente
    return {
      id: (Date.now() + 1).toString(),
      content:
        "Entendi! Para melhor atendê-lo, nossa equipe especializada pode te ajudar com informações mais detalhadas. Aqui estão algumas opções:",
      sender: "bot",
      timestamp: new Date(),
      quickActions: [
        { label: "Falar no WhatsApp", action: "whatsapp", icon: MessageCircle },
        { label: "Ver Imóveis", action: "/imoveis", icon: Home },
        {
          label: "Simular Financiamento",
          action: "/simulador-financiamento",
          icon: Calculator,
        },
      ],
    };
  };

  const handleQuickAction = (action: string) => {
    if (action === "whatsapp") {
      window.open(
        "https://wa.me/5562985563905?text=Olá! Vim do site e gostaria de mais informações.",
        "_blank",
      );
    } else if (action === "phone") {
      window.open("tel:5562985563905", "_self");
    } else if (action === "contact") {
      window.open("https://wa.me/5562985563905", "_blank");
    } else if (action.startsWith("/")) {
      window.open(action, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 h-96 shadow-2xl border bg-background/95 backdrop-blur-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Assistente Inteligente</h3>
              <p className="text-xs opacity-90 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Especialista em Imóveis
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-primary-foreground hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div
                  className={cn(
                    "flex items-start space-x-2 max-w-[85%]",
                    message.sender === "user"
                      ? "ml-auto flex-row-reverse space-x-reverse"
                      : "",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-white",
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-muted",
                    )}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {message.content}
                  </div>
                </div>

                {/* Sugestões */}
                {message.suggestions && message.sender === "bot" && (
                  <div className="flex flex-wrap gap-1 ml-10">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Ações rápidas */}
                {message.quickActions && message.sender === "bot" && (
                  <div className="flex flex-wrap gap-2 ml-10">
                    {message.quickActions.map((quickAction, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickAction(quickAction.action)}
                        className="text-xs h-7"
                      >
                        {quickAction.icon && (
                          <quickAction.icon className="h-3 w-3 mr-1" />
                        )}
                        {quickAction.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default EnhancedChatInterface;
