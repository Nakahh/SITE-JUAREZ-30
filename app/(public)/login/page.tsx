"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Home,
  Shield,
  User,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validações do cliente
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting login for:", email);

      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      console.log("Login result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);

        if (result.error === "CredentialsSignin") {
          setError("Email ou senha incorretos. Verifique suas credenciais.");
        } else {
          setError("Erro na autenticação. Tente novamente.");
        }
      } else if (result?.ok) {
        console.log("Login successful, getting session...");

        // Aguardar um momento para a sessão ser estabelecida
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verificar a sessão para determinar o redirecionamento
        const session = await getSession();
        console.log("Session retrieved:", session);

        if (session?.user) {
          if (session.user.role === "ADMIN") {
            console.log("Redirecting admin to /admin");
            router.push("/admin");
          } else {
            console.log("Redirecting user to /dashboard");
            router.push("/dashboard");
          }
          router.refresh();
        } else {
          setError("Erro ao estabelecer sessão. Tente novamente.");
        }
      } else {
        setError("Erro inesperado durante o login.");
      }
    } catch (error) {
      console.error("Login exception:", error);
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const quickLoginUsers = [
    {
      email: "admin@siqueiracampos.com",
      role: "ADMIN",
      name: "Administrador",
      icon: Shield,
    },
    {
      email: "corretor@siqueiracampos.com",
      role: "AGENT",
      name: "Corretor",
      icon: User,
    },
    {
      email: "usuario@teste.com",
      role: "USER",
      name: "Usuário",
      icon: User,
    },
  ];

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("123456"); // Senha padrão para demo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Link href="/" className="inline-block">
            <Image
              src={
                theme === "dark"
                  ? "/siqueira campos para fundo escuro.png"
                  : "/siqueira campos para fundo claro.png"
              }
              alt="Siqueira Campos Imóveis"
              width={200}
              height={60}
              className="h-12 w-auto mx-auto"
            />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Bem-vindo de volta!</h1>
            <p className="text-muted-foreground">
              Entre com sua conta para continuar
            </p>
          </div>
        </motion.div>

        {/* Quick Login Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Acesso Rápido - Demo</CardTitle>
              <CardDescription className="text-xs">
                Clique para preencher automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickLoginUsers.map((user, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => quickLogin(user.email)}
                  className="w-full justify-start text-xs h-8"
                >
                  <user.icon className="h-3 w-3 mr-2" />
                  <span className="flex-1 text-left">{user.name}</span>
                  <Badge variant="outline" className="text-xs h-4">
                    {user.role}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-2xl border-border/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold text-center">
                Entrar
              </CardTitle>
              <CardDescription className="text-center">
                Acesse sua conta para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="h-4 w-4" />
                      <span>Entrar</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                type="button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </Button>

              <div className="text-center space-y-2">
                <Link
                  href="/register"
                  className="text-sm text-primary hover:underline block"
                >
                  Não tem uma conta? Cadastre-se
                </Link>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:underline block"
                >
                  Esqueceu sua senha?
                </Link>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:underline flex items-center justify-center space-x-1"
                >
                  <Home className="h-3 w-3" />
                  <span>Voltar ao site</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Powered by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <span>Desenvolvido por</span>
            <Link
              href="/desenvolvedor"
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <Image
                src="/logo-kryonix.png"
                alt="Kryonix"
                width={16}
                height={16}
                className="rounded"
              />
              <span className="font-medium">Kryonix</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
