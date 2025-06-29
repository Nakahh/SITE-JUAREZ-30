import type React from "react";
import { Navbar } from "@/components/navbar";
import { AppFooter } from "@/components/app-footer"; // Renomeado para evitar conflito e ser mais específico
import { FloatingChatBubble } from "@/components/floating-chat-bubble";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className={cn("flex flex-col min-h-screen bg-background text-foreground")}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
      <FloatingChatBubble />
    </ThemeProvider>
  );
}
