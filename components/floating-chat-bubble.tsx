"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Eu sou a assistente virtual da Siqueira Campos Imóveis. Como posso ajudá-lo hoje?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("preço") || lowerMessage.includes("valor")) {
      return "Para informações sobre preços, entre em contato conosco pelo WhatsApp (62) 9 8556-3905 ou visite nossa página de imóveis para ver os valores atualizados.";
    }

    if (lowerMessage.includes("agendar") || lowerMessage.includes("visita")) {
      return "Ótimo! Você pode agendar uma visita diretamente pelo nosso site na página do imóvel ou entrando em contato pelo WhatsApp (62) 9 8556-3905.";
    }

    if (lowerMessage.includes("financiamento") || lowerMessage.includes("financiar")) {
      return "Temos um simulador de financiamento em nosso site! Também podemos ajudar com as melhores opções de crédito. Fale conosco pelo WhatsApp (62) 9 8556-3905.";
    }

    if (lowerMessage.includes("localização") || lowerMessage.includes("endereço")) {
      return "Nossos imóveis estão localizados em diversas regiões de Goiânia. Você pode filtrar por localização em nossa página de imóveis ou nos contar sua preferência pelo WhatsApp (62) 9 8556-3905.";
    }

    return "Entendi sua mensagem! Para um atendimento mais detalhado, recomendo entrar em contato conosco pelo WhatsApp (62) 9 8556-3905. Nossa equipe especializada está pronta para ajudá-lo!";
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg chat-bubble"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 md:w-96"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat Siqueira Campos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isBot ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          message.isBot
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 text-center">
                    <a
                      href="https://wa.me/5562985563905"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      💬 Fale direto no WhatsApp
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}