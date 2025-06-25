import type React from "react"
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Implementar layout específico para a área do cliente aqui */}
      {children}
    </div>
  )
}
