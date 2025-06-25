"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Home,
  LogOut,
  LayoutDashboard,
  Heart,
  Search,
  Calendar,
  User,
  Star,
  Mail,
  Newspaper,
  MessageSquare,
  DollarSign,
  Building,
  Users,
} from "lucide-react" // Adicionado todos os ícones necessários
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { KryonixLogo } from "./kryonix-logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: string[]
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const userRole = session?.user?.papel || "CLIENTE"
  const userName = session?.user?.name || session?.user?.email || "Usuário"

  const adminNavigationItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
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
  ].filter((item) => item.roles.includes(userRole))

  const clientDashboardItems: NavItem[] = [
    {
      title: "Visão Geral",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["CLIENTE", "ADMIN", "CORRETOR", "ASSISTENTE"],
    },
    {
      title: "Meu Perfil",
      href: "/dashboard/perfil",
      icon: User,
      roles: ["CLIENTE", "ADMIN", "CORRETOR", "ASSISTENTE"],
    },
    {
      title: "Favoritos",
      href: "/dashboard/favoritos", // Redireciona para a página de favoritos pública
      icon: Heart,
      roles: ["CLIENTE", "ADMIN", "CORRETOR", "ASSISTENTE"],
    },
    {
      title: "Buscas Salvas",
      href: "/dashboard/buscas-salvas",
      icon: Search,
      roles: ["CLIENTE", "ADMIN", "CORRETOR", "ASSISTENTE"],
    },
    {
      title: "Minhas Visitas",
      href: "/dashboard/visitas",
      icon: Calendar,
      roles: ["CLIENTE", "ADMIN", "CORRETOR", "ASSISTENTE"],
    },
    {
      title: "Minhas Avaliações",
      href: "/dashboard/minhas-avaliacoes",
      icon: Star,
      roles: ["CLIENTE", "ADMIN", "CORRETOR", "ASSISTENTE"],
    },
  ].filter((item) => item.roles.includes(userRole))

  return (
    <>
      {/* Sidebar para telas maiores */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <KryonixLogo className="h-8 w-auto" />
            <span className="sr-only">Siqueira Campos Imóveis</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid items-start px-4 text-sm font-medium">
            {session?.user && (
              <>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">Área do Cliente</h3>
                {clientDashboardItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      pathname.startsWith(item.href) && "bg-muted text-primary",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4" />
              </>
            )}

            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">Área Administrativa</h3>
            {adminNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname.startsWith(item.href) && "bg-muted text-primary",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={session?.user?.image || "/placeholder-user.jpg"} />
                  <AvatarFallback>{session?.user?.name?.[0] || session?.user?.email?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">{userRole}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[calc(100%-32px)] md:w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/perfil" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Sheet para telas menores */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Home className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <div className="flex h-16 items-center px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <KryonixLogo className="h-8 w-auto" />
              <span className="sr-only">Siqueira Campos Imóveis</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="grid items-start px-4 text-sm font-medium">
              {session?.user && (
                <>
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">Área do Cliente</h3>
                  {clientDashboardItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname.startsWith(item.href) && "bg-muted text-primary",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                  <div className="mt-4 border-t pt-4" />
                </>
              )}

              <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">Área Administrativa</h3>
              {adminNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname.startsWith(item.href) && "bg-muted text-primary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="mt-auto p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={session?.user?.image || "/placeholder-user.jpg"} />
                    <AvatarFallback>{session?.user?.name?.[0] || session?.user?.email?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">{userRole}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[calc(100%-32px)] md:w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/perfil" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
