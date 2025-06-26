import type React from "react"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex">
        <aside className="w-64 bg-gray-100 p-4">
          <nav>
            <ul>
              <li>
                <Link href="/app/dashboard">Dashboard do Cliente</Link>
              </li>
              {/* Outros links da barra lateral */}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  )
}
