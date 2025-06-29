
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Menu, 
  Search, 
  Heart, 
  User, 
  Phone,
  Home,
  Building,
  Calculator,
  MessageSquare,
  Users,
  BookOpen,
  Award
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export default function Navbar() {
  const { data: session } = useSession()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme === 'dark' : false

  const logoSrc = isDark 
    ? "/logo siqueira campos imoveis.png" // Logo para fundo escuro
    : "/logo siqueira campos imoveis.png" // Logo para fundo claro

  const navigationItems = [
    {
      title: "Imóveis",
      href: "/imoveis",
      icon: Home,
      description: "Encontre seu imóvel ideal"
    },
    {
      title: "Sobre",
      href: "/sobre", 
      icon: Building,
      description: "Conheça nossa história"
    },
    {
      title: "Serviços",
      items: [
        { title: "Simulador de Financiamento", href: "/simulador-financiamento", icon: Calculator },
        { title: "Avaliação de Imóvel", href: "/contato", icon: Award },
        { title: "Consultoria", href: "/contato", icon: MessageSquare }
      ]
    },
    {
      title: "Blog",
      href: "/blog",
      icon: BookOpen,
      description: "Dicas e novidades do mercado"
    },
    {
      title: "Equipe",
      href: "/corretores",
      icon: Users,
      description: "Conheça nossos corretores"
    },
    {
      title: "Contato",
      href: "/contato",
      icon: Phone,
      description: "Fale conosco"
    }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-auto">
              <Image
                src={logoSrc}
                alt="Siqueira Campos Imóveis"
                height={40}
                width={200}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="text-sm font-medium">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-64 p-2">
                          {item.items.map((subItem) => (
                            <NavigationMenuLink
                              key={subItem.title}
                              asChild
                            >
                              <Link
                                href={subItem.href}
                                className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent transition-colors"
                              >
                                <subItem.icon className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">{subItem.title}</span>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href!} legacyBehavior passHref>
                      <NavigationMenuLink className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent transition-colors">
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <Link href="/imoveis">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            {/* Favorites */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/favoritos">
                <Heart className="h-4 w-4" />
              </Link>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {session ? (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" asChild className="hidden md:flex">
                <Link href="/login">
                  Entrar
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex justify-center mb-8">
                    <Image
                      src={logoSrc}
                      alt="Siqueira Campos Imóveis"
                      height={40}
                      width={160}
                      className="object-contain"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  {navigationItems.map((item) => (
                    <div key={item.title} className="space-y-2">
                      {item.items ? (
                        <>
                          <h3 className="font-semibold text-sm text-primary px-2">
                            {item.title}
                          </h3>
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors"
                            >
                              <subItem.icon className="h-4 w-4 text-primary" />
                              <span className="text-sm">{subItem.title}</span>
                            </Link>
                          ))}
                        </>
                      ) : (
                        <Link
                          href={item.href!}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors"
                        >
                          <item.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Mobile Actions */}
                  <div className="pt-4 border-t space-y-2">
                    {!session && (
                      <Button asChild className="w-full">
                        <Link href="/login">
                          Entrar
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
