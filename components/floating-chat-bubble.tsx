"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedChatInterface } from "@/components/enhanced-chat-interface";

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Enhanced Chat Interface */}
      <EnhancedChatInterface isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Chat Toggle Button - só aparece quando o chat está fechado */}
      {!isOpen && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 relative overflow-hidden"
          >
            <motion.div
              className="relative"
              animate={{
                y: [0, -2, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <MessageCircle className="h-7 w-7" />

              {/* Indicator pulsante */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export default FloatingChatBubble;
