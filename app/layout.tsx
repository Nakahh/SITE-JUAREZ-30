import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { LazyFloatingChatBubble } from "@/components/lazy-components";
import Script from "next/script";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SC Imóveis" />
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
            <LazyFloatingChatBubble />
            <Toaster />
            <SonnerToaster
              position="top-right"
              richColors
              closeButton
              theme="system"
            />
          </SessionProvider>
        </ThemeProvider>

        {/* Emergency reset and cache clear */}
        <Script id="emergency-reset" strategy="afterInteractive">
          {`
            // EMERGENCY RESET - Detect and fix Fly.dev connections
            window.addEventListener('load', function() {
              // Check for any fetch calls to external domains
              const originalFetch = window.fetch;
              window.fetch = function(...args) {
                const url = args[0];
                if (typeof url === 'string' && url.includes('fly.dev')) {
                  console.error('🚨 BLOCKED FLY.DEV REQUEST:', url);
                  alert('Detected Fly.dev connection attempt! Click OK to reset.');
                  window.location.href = '/reset.html';
                  return Promise.reject(new Error('Blocked external request'));
                }
                return originalFetch.apply(this, args);
              };

              // Clear all existing caches and workers
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  registrations.forEach(function(registration) {
                    registration.unregister();
                  });
                });
              }

              if ('caches' in window) {
                caches.keys().then(function(names) {
                  names.forEach(function(name) {
                    caches.delete(name);
                  });
                });
              }

              // Add emergency reset button
              if (window.location.pathname === '/') {
                const resetBtn = document.createElement('button');
                resetBtn.innerHTML = '🔥 Emergency Reset';
                resetBtn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;background:red;color:white;border:none;padding:10px;border-radius:5px;cursor:pointer;';
                resetBtn.onclick = () => window.location.href = '/reset.html';
                document.body.appendChild(resetBtn);
              }
            });
          `}
        </Script>

        {/* Performance monitoring */}
        <Script id="performance-monitor" strategy="afterInteractive">
          {`
            // Web Vitals monitoring
            if (typeof window !== 'undefined') {
              function sendToAnalytics(metric) {
                // Send performance metrics to analytics
                console.log('Performance metric:', metric);
              }

              // Monitor Core Web Vitals
              if ('PerformanceObserver' in window) {
                try {
                  const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                      if (entry.entryType === 'largest-contentful-paint') {
                        sendToAnalytics({ name: 'LCP', value: entry.startTime });
                      }
                      if (entry.entryType === 'first-input') {
                        sendToAnalytics({ name: 'FID', value: entry.processingStart - entry.startTime });
                      }
                      if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                        sendToAnalytics({ name: 'CLS', value: entry.value });
                      }
                    });
                  });

                  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
                } catch (e) {
                  console.log('Performance observer not supported');
                }
              }
            }
          `}
        </Script>
      </body>
    </html>
  );
}
