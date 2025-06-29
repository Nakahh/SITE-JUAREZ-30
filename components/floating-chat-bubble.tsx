'use client'

import { useState } from 'react'
import ChatInterface from './chat-interface'

export default function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const closeChat = () => {
    setIsOpen(false)
  }

  return (
    <>
      <ChatInterface
        isMinimized={!isOpen}
        onToggleMinimize={toggleChat}
        onClose={closeChat}
      />
    </>
  )
}