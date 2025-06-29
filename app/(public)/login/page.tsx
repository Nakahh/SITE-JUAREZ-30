"use client"

import { useState, useEffect } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  useEffect(() => {
    // Verificar se há erro na URL
    const urlError = searchParams.get("error")
    if (urlError) {
      setError(getErrorMessage(urlError))
    }
  }, [searchParams])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "CredentialsSignin":
        return "Email ou senha incorretos."
      case "EmailCreateAccount":
        return "Erro ao criar conta. Tente novamente."
      case "OAuthCreateAccount":
        return "Erro ao entrar com Google. Tente novamente."
      case "EmailSignin":
        return "Erro ao enviar email de verificação."
      case "OAuthSignin":
        return "Erro ao entrar com provedor externo."
      case "OAuthCallback":
        return "Erro durante autenticação. Tente novamente."
      case "EmailVerification":
        return "Token de verificação inválido."
      case "SessionRequired":
        return "É necessário fazer login para acessar esta página."
      default:
        return "Ocorreu um erro durante o login. Tente novamente."
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        const errorMessage = getErrorMessage(result.error)
        setError(errorMessage)
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        })
      } else {
        // Verificar se a sessão foi criada
        const session = await getSession()
        if (session) {
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo(a), ${session.user?.name || session.user?.email}!`,
          })
          router.push(callbackUrl)
          router.refresh()
        } else {
          setError("Erro ao criar sessão. Tente novamente.")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Ocorreu um erro durante o login")
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="container py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => signIn("google")}
            className="w-full max-w-xs"
            disabled={isLoading}
          >
            Entrar com Google
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </section>
  )
}