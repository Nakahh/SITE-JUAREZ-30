import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Home, Building, Users, Newspaper, MessageSquare, DollarSign, Calendar, Star, Mail } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const userRole = session.user?.papel || "CLIENTE"
  const userName = session.user?.name || session.user?.email || "Usuário"

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
      roles: ["ADMIN", "CORRETOR", "ASSISTENTE"],
    },
    {
      title: "Imóveis",
      href: "/admin/imoveis",
      icon: Building,
      roles: ["ADMIN", "CORRETOR", "ASSISTENTE"],
    },
    {
      title: "Leads",
      href: "/admin/leads",
      icon: Users,
      roles: ["ADMIN", "CORRETOR"],
    },
    {
      title: "Visitas",
      href: "/admin/visitas",
      icon: Calendar,
      roles: ["ADMIN", "CORRETOR"],
    },
    {
      title: "Financeiro",
      href: "/admin/financeiro",
      icon: DollarSign,
      roles: ["ADMIN"],
    },
    {
      title: "Blog",
      href: "/admin/blog",
      icon: Newspaper,
      roles: ["ADMIN"],
    },
    {
      title: "Depoimentos",
      href: "/admin/depoimentos",
      icon: Star,
      roles: ["ADMIN"],
    },
    {
      title: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      roles: ["ADMIN"],
    },
    {
      title: "Usuários",
      href: "/admin/usuarios",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      title: "Chat",
      href: "/admin/chat",
      icon: MessageSquare,
      roles: ["ADMIN", "CORRETOR", "ASSISTENTE"],
    },
  ].filter((item) => item.roles.includes(userRole)) // Filtra itens com base no papel do usuário

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar navItems={navigationItems} userRole={userRole} userName={userName} />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
