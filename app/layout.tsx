import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { FloatingChatBubble } from "@/components/floating-chat-bubble";

export const metadata: Metadata = {
  title: {
    default: "Siqueira Campos Imóveis | Encontre seu imóvel dos sonhos",
    template: "%s | Siqueira Campos Imóveis",
  },
  description:
    "O melhor lugar para encontrar o seu imóvel em Siqueira Campos e região. Casas, apartamentos, terrenos e mais com o melhor atendimento.",
  keywords: [
    "imóveis",
    "Siqueira Campos",
    "casas",
    "apartamentos",
    "terrenos",
    "venda",
    "aluguel",
    "corretores",
    "imobiliária",
  ],
  authors: [{ name: "Siqueira Campos Imóveis" }],
  creator: "KRYONIX - Soluções Digitais",
  publisher: "Siqueira Campos Imóveis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://siqueiracamposimoveis.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://siqueiracamposimoveis.com.br",
    siteName: "Siqueira Campos Imóveis",
    title: "Siqueira Campos Imóveis - Seu Imóvel dos Sonhos",
    description:
      "Encontre o imóvel perfeito em Siqueira Campos e região. Casas, apartamentos, terrenos e mais.",
    images: [
      {
        url: "/logo siqueira campos imoveis.png",
        width: 1200,
        height: 630,
        alt: "Siqueira Campos Imóveis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siqueira Campos Imóveis",
    description: "Encontre o imóvel perfeito em Siqueira Campos e região.",
    images: ["/logo siqueira campos imoveis.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo siqueira campos imoveis.png" />
        <link rel="apple-touch-icon" href="/logo siqueira campos imoveis.png" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased min-h-screen bg-background font-sans overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="siqueira-theme"
        >
          <SessionProvider>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1 w-full">{children}</main>
            </div>
            <FloatingChatBubble />
            <Toaster />
            <SonnerToaster
              position="top-right"
              richColors
              closeButton
              theme="system"
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
