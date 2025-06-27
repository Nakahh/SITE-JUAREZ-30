"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { sendWhatsAppMessage } from "@/app/actions/whatsapp-actions"
import { getWhatsappAiStatus, toggleWhatsappAiStatus } from "@/app/actions/app-settings-actions"
import { Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function WhatsAppAdminPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAiEnabled, setIsAiEnabled] = useState(false)
  const [isAiStatusLoading, setIsAiStatusLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAiStatus = async () => {
      setIsAiStatusLoading(true)
      const status = await getWhatsappAiStatus()
      setIsAiEnabled(status)
      setIsAiStatusLoading(false)
    }
    fetchAiStatus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!phoneNumber || !message) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o número de telefone e a mensagem.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const formattedPhoneNumber = phoneNumber.replace(/\D/g, "")

    const result = await sendWhatsAppMessage({ to: formattedPhoneNumber, message })

    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      })
      setPhoneNumber("")
      setMessage("")
    } else {
      toast({
        title: "Erro ao Enviar",
        description: result.message || "Ocorreu um erro ao enviar a mensagem.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const handleToggleAi = async (checked: boolean) => {
    setIsAiStatusLoading(true)
    const result = await toggleWhatsappAiStatus(checked)
    if (result.success) {
      setIsAiEnabled(checked)
      toast({
        title: "Sucesso!",
        description: result.message,
      })
    } else {
      toast({
        title: "Erro",
        description: result.message || "Não foi possível alterar o status da IA.",
        variant: "destructive",
      })
    }
    setIsAiStatusLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">WhatsApp API</h1>
      <p className="text-muted-foreground">Gerencie a integração com a Evolution API e a IA do WhatsApp.</p>

      <Card>
        <CardHeader>
          <CardTitle>Controle da IA do WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="ai-mode">{isAiEnabled ? "IA Ativada" : "IA Desativada"}</Label>
            {isAiStatusLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                id="ai-mode"
                checked={isAiEnabled}
                onCheckedChange={handleToggleAi}
                disabled={isAiStatusLoading}
              />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Quando ativada, a IA responderá automaticamente às mensagens recebidas no WhatsApp.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enviar Mensagem WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Telefone (Ex: 5543999999999)
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Ex: 5543999999999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                "Enviar Mensagem"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
