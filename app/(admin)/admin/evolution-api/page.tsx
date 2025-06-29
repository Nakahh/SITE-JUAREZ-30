
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Settings, 
  QrCode, 
  MessageCircle,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react"

interface ConnectionStatus {
  connected: boolean
  instanceName: string
  phoneNumber?: string
  lastUpdate: Date
  qrCode?: string
}

interface WhatsAppMessage {
  id: string
  from: string
  message: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

export default function EvolutionAPIPage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    instanceName: "siqueira-campos-main",
    lastUpdate: new Date()
  })
  
  const [config, setConfig] = useState({
    apiUrl: process.env.EVOLUTION_API_URL || "http://localhost:8080",
    apiKey: process.env.EVOLUTION_API_KEY || "",
    instanceName: "siqueira-campos-main",
    webhookUrl: `${process.env.NEXTAUTH_URL}/api/whatsapp-webhook`
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      from: "5562985563905",
      message: "Olá! Gostaria de saber mais sobre o apartamento anunciado.",
      timestamp: new Date(Date.now() - 300000),
      status: 'read'
    },
    {
      id: "2", 
      from: "5562987654321",
      message: "Vocês fazem financiamento?",
      timestamp: new Date(Date.now() - 600000),
      status: 'delivered'
    }
  ])

  const [stats, setStats] = useState({
    totalMessages: 156,
    responsesTime: "2.3min",
    conversionRate: "18%",
    activeChats: 8
  })

  useEffect(() => {
    checkConnectionStatus()
    const interval = setInterval(checkConnectionStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkConnectionStatus = async () => {
    try {
      // Simular verificação de status
      setConnectionStatus(prev => ({
        ...prev,
        connected: Math.random() > 0.3,
        phoneNumber: prev.connected ? "55 62 9 8556-3905" : undefined,
        lastUpdate: new Date()
      }))
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    }
  }

  const connectInstance = async () => {
    setIsLoading(true)
    try {
      // Simular conexão
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setConnectionStatus({
        connected: true,
        instanceName: config.instanceName,
        phoneNumber: "55 62 9 8556-3905",
        lastUpdate: new Date(),
        qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
      })
    } catch (error) {
      console.error("Erro ao conectar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectInstance = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setConnectionStatus(prev => ({
        ...prev,
        connected: false,
        phoneNumber: undefined,
        qrCode: undefined
      }))
    } catch (error) {
      console.error("Erro ao desconectar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestMessage = async () => {
    try {
      // Simular envio de mensagem de teste
      const newMessage: WhatsAppMessage = {
        id: Date.now().toString(),
        from: "5562985563905",
        message: "Esta é uma mensagem de teste do sistema.",
        timestamp: new Date(),
        status: 'sent'
      }
      setMessages(prev => [newMessage, ...prev])
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Evolution API - WhatsApp Business</h1>
        <p className="text-muted-foreground">
          Configure e monitore a integração do WhatsApp Business com o sistema
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              {connectionStatus.connected ? (
                <Wifi className="h-8 w-8 text-green-500" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-2xl font-bold">
                  {connectionStatus.connected ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensagens</p>
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Resposta</p>
                <p className="text-2xl font-bold">{stats.responsesTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chats Ativos</p>
                <p className="text-2xl font-bold">{stats.activeChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connection" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Status da Conexão</span>
              </CardTitle>
              <CardDescription>
                Status atual da instância WhatsApp Business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Instância: {connectionStatus.instanceName}</p>
                  {connectionStatus.phoneNumber && (
                    <p className="text-sm text-muted-foreground">
                      Número: {connectionStatus.phoneNumber}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Última verificação: {connectionStatus.lastUpdate.toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={connectionStatus.connected ? "default" : "destructive"}>
                    {connectionStatus.connected ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {connectionStatus.connected ? "Conectado" : "Desconectado"}
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkConnectionStatus}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex space-x-2">
                {!connectionStatus.connected ? (
                  <Button onClick={connectInstance} disabled={isLoading}>
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wifi className="h-4 w-4 mr-2" />
                    )}
                    Conectar WhatsApp
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="destructive" 
                      onClick={disconnectInstance}
                      disabled={isLoading}
                    >
                      <WifiOff className="h-4 w-4 mr-2" />
                      Desconectar
                    </Button>
                    <Button variant="outline" onClick={sendTestMessage}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Teste
                    </Button>
                  </>
                )}
              </div>

              {connectionStatus.qrCode && !connectionStatus.connected && (
                <Alert>
                  <QrCode className="h-4 w-4" />
                  <AlertDescription>
                    Escaneie o QR Code abaixo com seu WhatsApp para conectar:
                    <div className="mt-2 p-4 bg-white rounded-lg inline-block">
                      <img src={connectionStatus.qrCode} alt="QR Code" className="w-32 h-32" />
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Mensagens Recentes</CardTitle>
              <CardDescription>
                Últimas mensagens recebidas via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">+{message.from}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {message.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações da API</CardTitle>
              <CardDescription>
                Configure os parâmetros de conexão com a Evolution API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">URL da API</Label>
                  <Input
                    id="apiUrl"
                    value={config.apiUrl}
                    onChange={(e) => setConfig(prev => ({...prev, apiUrl: e.target.value}))}
                    placeholder="http://localhost:8080"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Chave da API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig(prev => ({...prev, apiKey: e.target.value}))}
                    placeholder="Sua chave da API"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instanceName">Nome da Instância</Label>
                  <Input
                    id="instanceName"
                    value={config.instanceName}
                    onChange={(e) => setConfig(prev => ({...prev, instanceName: e.target.value}))}
                    placeholder="siqueira-campos-main"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL do Webhook</Label>
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig(prev => ({...prev, webhookUrl: e.target.value}))}
                    placeholder="https://seu-site.com/api/whatsapp-webhook"
                  />
                </div>
              </div>
              
              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          {/* Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Webhooks</CardTitle>
              <CardDescription>
                Configure os eventos que serão enviados para o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Os webhooks permitem que o sistema receba notificações automáticas 
                  sobre mensagens, status de entrega e outros eventos do WhatsApp.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Eventos Configurados</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mensagens Recebidas</span>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status de Entrega</span>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conexão/Desconexão</span>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
