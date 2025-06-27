import type React from "react"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/session-provider"
import { Sidebar } from "@/components/sidebar"
import { auth } from "@/lib/auth" // Importação corrigida

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Siqueira Campos Imóveis - Admin",
  description: "Painel administrativo para gerenciar imóveis, usuários, leads e mais.",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth() // Obter a sessão aqui

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider session={session}>
            {" "}
            {/* Passar a sessão para o SessionProvider */}
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6 lg:p-10">{children}</main>
            </div>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
