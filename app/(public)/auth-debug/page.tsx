"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AuthDebugPage() {
  const { data: session, status } = useSession();

  return (
    <div className="container py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Debug de Autenticação</h1>
        <p className="text-muted-foreground mt-2">
          Página para testar e debugar o sistema de autenticação
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Status da Sessão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <Badge
                variant={
                  status === "authenticated"
                    ? "default"
                    : status === "loading"
                      ? "secondary"
                      : "destructive"
                }
              >
                {status}
              </Badge>
            </div>

            {session?.user && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-sm">{session.user.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Nome:</span>
                  <span className="text-sm">
                    {session.user.name || "Não definido"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">ID:</span>
                  <span className="text-sm font-mono">{session.user.id}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Papel:</span>
                  <Badge variant="outline">{session.user.role}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Imagem:</span>
                  <span className="text-sm">
                    {session.user.image || "Nenhuma"}
                  </span>
                </div>
              </>
            )}

            {status === "unauthenticated" && (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  Usuário não autenticado
                </p>
                <Link href="/login">
                  <Button>Fazer Login</Button>
                </Link>
              </div>
            )}

            {status === "authenticated" && (
              <div className="text-center py-4">
                <Button
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Brutos da Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Dashboard do Usuário
                </Button>
              </Link>

              <Link href="/admin">
                <Button variant="outline" className="w-full">
                  Dashboard Admin (apenas ADMIN)
                </Button>
              </Link>

              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Página de Login
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  Página Inicial
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm space-y-1">
              <p>
                <strong>Admin:</strong> admin@siqueiracampos.com / 123456
              </p>
              <p>
                <strong>Corretor:</strong> corretor@siqueiracampos.com / 123456
              </p>
              <p>
                <strong>Usuário:</strong> usuario@teste.com / 123456
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
