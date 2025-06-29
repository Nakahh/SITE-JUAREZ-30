"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { Building, LogOut, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { data: session } = useSession();

  const navigationItems = [
    { href: "/", label: "Início" },
    { href: "/imoveis", label: "Imóveis" },
    { href: "/simulador-financiamento", label: "Simulador" },
    { href: "/blog", label: "Blog" },
    { href: "/depoimentos", label: "Depoimentos" },
    { href: "/corretores", label: "Corretores" },
    { href: "/contato", label: "Contato" },
    { href: "/desenvolvedor", label: "Desenvolvedor" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img
            src="/logo-siqueira.svg"
            alt="Siqueira Campos Imóveis"
            className="h-10 w-auto"
          />
          <span className="hidden sm:inline text-lg font-bold text-primary">
            Siqueira Campos
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image || "/placeholder-user.svg"}
                      alt={session.user?.name || "Usuário"}
                    />
                    <AvatarFallback>
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Painel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
