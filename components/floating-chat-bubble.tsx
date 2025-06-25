"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { ChatInterface } from "./chat-interface"

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      {isOpen && <ChatInterface onClose={() => setIsOpen(false)} />}
    </>
  )
}
