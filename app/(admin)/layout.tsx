import type React from "react"
import Sidebar from "@/components/Sidebar"

interface Props {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
