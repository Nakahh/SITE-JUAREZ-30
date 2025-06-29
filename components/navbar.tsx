
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { 
  Menu, 
  X, 
  Home, 
  Building, 
  Users, 
  MessageSquare, 
  Phone, 
  User,
  LogOut,
  Settings,
  Heart,
  Search,
  FileText,
  Bell,
  Calendar,
  Calculator
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === 'dark'
  const logoSrc = isDark 
    ? "/siqueira campos para fundo escuro.png" 
    : "/siqueira campos para fundo claro.png"

  const navItems = [
    { href: "/", label: "Início", icon: Home, badge: null },
    { href: "/imoveis", label: "Imóveis", icon: Building, badge: "Novo" },
    { href: "/corretores", label: "Corretores", icon: Users, badge: null },
    { href: "/simulador-financiamento", label: "Simulador", icon: Calculator, badge: "Popular" },
    { href: "/blog", label: "Blog", icon: FileText, badge: null },
    { href: "/sobre", label: "Sobre", icon: MessageSquare, badge: null },
    { href: "/contato", label: "Contato", icon: Phone, badge: null },
  ]

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b",
      isScrolled 
        ? 'bg-background/80 backdrop-blur-xl shadow-lg border-border' 
        : 'bg-background/95 backdrop-blur-md border-border/50',
      'supports-[backdrop-filter]:bg-background/60'
    )}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo Enhanced */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Image 
              src={logoSrc} 
              alt="Siqueira Campos" 
              width={180} 
              height={60}
              className="h-10 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Enhanced */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 group"
            >
              <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  {item.badge}
                </Badge>
              )}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
        </div>

        {/* Right Section Enhanced */}
        <div className="flex items-center space-x-2">
          {/* Notifications (if user is logged in) */}
          {session && (
            <Button variant="ghost" size="sm" className="relative hidden md:flex">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-destructive p-0">
                3
              </Badge>
            </Button>
          )}

          <ThemeToggle />

          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-transparent hover:border-primary transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-semibold">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {session.user?.role === "ADMIN" ? "Administrador" : 
                         session.user?.role === "AGENT" ? "Corretor" : "Cliente"}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <User className="mr-3 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/favoritos" className="flex items-center">
                    <Heart className="mr-3 h-4 w-4" />
                    Favoritos
                    <Badge className="ml-auto text-xs">5</Badge>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buscas-salvas" className="flex items-center">
                    <Search className="mr-3 h-4 w-4" />
                    Buscas Salvas
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/visitas" className="flex items-center">
                    <Calendar className="mr-3 h-4 w-4" />
                    Minhas Visitas
                  </Link>
                </DropdownMenuItem>

                {(session.user?.role === "ADMIN" || session.user?.role === "AGENT") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-3 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center cursor-pointer text-destructive hover:text-destructive focus:text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild className="hover:bg-accent/50">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">
                <Link href="/register">Cadastrar</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button Enhanced */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden relative p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative w-6 h-6 flex flex-col justify-center">
              <span className={cn(
                "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
              )} />
              <span className={cn(
                "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              )} />
              <span className={cn(
                "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
              )} />
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Enhanced */}
      <div className={cn(
        "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen 
          ? 'max-h-screen opacity-100 border-t border-border bg-background/95 backdrop-blur-xl' 
          : 'max-h-0 opacity-0'
      )}>
        <div className="container px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 transform",
                isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}

          {!session && (
            <div className="pt-4 space-y-2 border-t border-border">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <User className="mr-3 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-primary to-secondary text-primary-foreground" asChild>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <User className="mr-3 h-4 w-4" />
                  Cadastrar
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
