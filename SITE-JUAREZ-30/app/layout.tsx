import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider" // Novo componente para o SessionProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Siqueira Campos Imóveis",
  description: "O melhor lugar para encontrar o seu imóvel em Siqueira Campos e região.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            {" "}
            {/* Envolve a aplicação com o SessionProvider */}
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
