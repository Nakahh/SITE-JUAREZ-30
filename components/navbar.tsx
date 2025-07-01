"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  Settings,
  Heart,
  Search,
  Phone,
  Mail,
  MapPin,
  Sun,
  Moon,
  Monitor,
  Home,
  Building,
  Users,
  MessageSquare,
  FileText,
  Calculator,
  Star,
  ChevronDown,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavItems = [
    { href: "/", label: "Início", icon: Home },
    {
      href: "/imoveis",
      label: "Imóveis",
      icon: Building,
      submenu: [
        {
          href: "/imoveis?tipo=venda",
          label: "Comprar",
          description: "Encontre seu imóvel ideal",
        },
        {
          href: "/imoveis?tipo=aluguel",
          label: "Alugar",
          description: "Imóveis para locação",
        },
        {
          href: "/imoveis?destaque=true",
          label: "Em Destaque",
          description: "Melhores oportunidades",
        },
        {
          href: "/comparar",
          label: "Comparar",
          description: "Compare imóveis lado a lado",
        },
      ],
    },
    { href: "/sobre", label: "Sobre", icon: Users },
    { href: "/corretores", label: "Corretores", icon: Users },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/contato", label: "Contato", icon: MessageSquare },
  ];

  const tools = [
    {
      href: "/simulador-financiamento",
      label: "Simulador",
      icon: Calculator,
      badge: "Novo",
    },
    { href: "/favoritos", label: "Favoritos", icon: Heart },
    { href: "/depoimentos", label: "Depoimentos", icon: Star },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-lg"
          : "bg-background/80 backdrop-blur-sm"
      }`}
      style={{ maxHeight: "120px" }}
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary/5 border-b border-border/50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(62) 9 8556-3905</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>siqueiraecamposimoveis@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Goiânia - GO</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                className="text-green-600 hover:text-green-700"
              >
                <WhatsAppIcon className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Claro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Escuro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    Sistema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 min-h-[4rem]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <Image
              src="/siqueira campos para fundo claro.png"
              alt="Siqueira Campos Imóveis"
              width={240}
              height={80}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] animate-slide-up dark:hidden object-contain"
              priority
            />
            <Image
              src="/siqueira campos para fundo escuro.png"
              alt="Siqueira Campos Imóveis"
              width={240}
              height={80}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] animate-slide-up hidden dark:block object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    {item.submenu ? (
                      <>
                        <NavigationMenuTrigger
                          className={`${
                            isActive(item.href)
                              ? "text-primary"
                              : "text-foreground"
                          } hover:text-primary transition-colors`}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4">
                            {item.submenu.map((subItem) => (
                              <NavigationMenuLink key={subItem.href} asChild>
                                <Link
                                  href={subItem.href}
                                  className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {subItem.label}
                                  </div>
                                  <p className="text-xs leading-relaxed text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={`group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                            isActive(item.href)
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Tools & User */}
          <div className="hidden lg:flex items-center space-x-4">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="relative flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <tool.icon className="h-4 w-4" />
                <span>{tool.label}</span>
                {tool.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {tool.badge}
                  </Badge>
                )}
              </Link>
            ))}

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/perfil">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-background/95 backdrop-blur-lg"
            >
              <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                <div className="py-4 space-y-2">
                  {/* Login/Register Section - Top of mobile menu */}
                  {!session ? (
                    <div className="px-4 pb-4 border-b border-border">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold">Acesso</h4>
                          {/* Theme Toggle - Top Right */}
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setTheme("light")}
                              className={`h-8 w-8 p-0 ${theme === "light" ? "bg-accent" : ""}`}
                            >
                              <Sun className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setTheme("dark")}
                              className={`h-8 w-8 p-0 ${theme === "dark" ? "bg-accent" : ""}`}
                            >
                              <Moon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9"
                            asChild
                          >
                            <Link
                              href="/login"
                              onClick={() => setIsOpen(false)}
                            >
                              <LogIn className="mr-2 h-4 w-4" />
                              Entrar
                            </Link>
                          </Button>
                          <Button size="sm" className="h-9" asChild>
                            <Link
                              href="/register"
                              onClick={() => setIsOpen(false)}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Cadastrar
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 pb-4 border-b border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={session.user?.image || ""}
                              alt={session.user?.name || ""}
                            />
                            <AvatarFallback>
                              {session.user?.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {session.user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                        {/* Theme Toggle - Top Right for logged users */}
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme("light")}
                            className={`h-8 w-8 p-0 ${theme === "light" ? "bg-accent" : ""}`}
                          >
                            <Sun className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme("dark")}
                            className={`h-8 w-8 p-0 ${theme === "dark" ? "bg-accent" : ""}`}
                          >
                            <Moon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          asChild
                        >
                          <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sair
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Main Navigation */}
                  {mainNavItems.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.href)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.submenu && (
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        )}
                      </Link>

                      {item.submenu && (
                        <div className="ml-6 space-y-1 pl-4 border-l border-border/50">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Tools Section */}
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="px-4 mb-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Ferramentas
                      </h4>
                    </div>
                    {tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors rounded-md mx-2"
                      >
                        <tool.icon className="h-4 w-4" />
                        <span>{tool.label}</span>
                        {tool.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs ml-auto"
                          >
                            {tool.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="px-4 mb-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Contato
                      </h4>
                    </div>
                    <div className="px-4 space-y-3">
                      <a
                        href="tel:(62)985563905"
                        className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span>(62) 9 8556-3905</span>
                      </a>
                      <a
                        href="mailto:siqueiraecamposimoveis@gmail.com"
                        className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span>siqueiraecamposimoveis@gmail.com</span>
                      </a>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Goiânia - GO</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        asChild
                      >
                        <a
                          href="https://wa.me/5562985563905"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon className="h-4 w-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
export default Navbar;
