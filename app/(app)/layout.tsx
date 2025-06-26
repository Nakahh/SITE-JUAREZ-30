import type React from "react"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/session-provider"
import { FloatingChatBubble } from "@/components/floating-chat-bubble"
import { auth } from "@/lib/auth" // Importação corrigida

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Siqueira Campos Imóveis - Dashboard",
  description: "Dashboard do cliente para gerenciar imóveis favoritos, buscas salvas e visitas.",
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth() // Obter a sessão aqui

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider session={session}>
            {" "}
            {/* Passar a sessão para o SessionProvider */}
            <div className="flex min-h-screen flex-col">
              {/* <Navbar /> */} {/* Se você tiver uma Navbar específica para o app, adicione aqui */}
              <main className="flex-1">{children}</main>
              {/* <Footer /> */} {/* Se você tiver um Footer específico para o app, adicione aqui */}
            </div>
            <FloatingChatBubble />
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
