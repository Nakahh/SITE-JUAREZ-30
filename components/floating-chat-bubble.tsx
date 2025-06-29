"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat-interface";
import { cn } from "@/lib/utils";

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg",
            "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90",
            "transition-all duration-300 hover:scale-110 animate-bounce"
          )}
          size="lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      <ChatInterface 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}