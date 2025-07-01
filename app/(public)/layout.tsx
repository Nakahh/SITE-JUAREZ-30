"use client";

import type React from "react";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { AppFooter } from "@/components/app-footer";
import { FloatingChatBubble } from "@/components/floating-chat-bubble";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20">{children}</main>
        <AppFooter />
        <FloatingChatBubble />
      </div>
    </SessionProvider>
  );
}
