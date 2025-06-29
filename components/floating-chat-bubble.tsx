'use client'

import { useState, useEffect } from 'react'
import ChatInterface from './chat-interface'
import { cn } from '@/lib/utils'

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false)
      setIsOpen(true)
    } else {
      setIsMinimized(true)
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }

  return (
    <div className="fixed z-50">
      <ChatInterface
        isMinimized={isMinimized}
        onToggleMinimize={handleToggle}
        onClose={handleClose}
        className={cn(
          "transition-all duration-300 ease-in-out",
          !isMinimized && "animate-in slide-in-from-bottom-4 fade-in-0"
        )}
      />
    </div>
  )
}