import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function AdminChat() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Chat Administrativo</h1>
        <p className="text-muted-foreground">Gerencie as conversas com seus clientes.</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Exemplo de mensagem */}
        <div className="flex justify-start">
          <div className="bg-gray-100 p-3 rounded-lg max-w-[70%]">
            <p className="font-semibold">Cliente A</p>
            <p>Olá, gostaria de mais informações sobre o imóvel no centro.</p>
            <span className="text-xs text-muted-foreground block text-right mt-1">10:00 AM</span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-primary text-white p-3 rounded-lg max-w-[70%]">
            <p>Claro! Qual imóvel especificamente? Posso te ajudar com as fotos e detalhes.</p>
            <span className="text-xs text-white/80 block text-right mt-1">10:05 AM</span>
          </div>
        </div>
        {/* Fim do exemplo */}
        <div className="text-center text-muted-foreground text-sm mt-8">
          <p>
            Para um sistema de chat em tempo real, você precisaria de uma solução de WebSockets (ex: Socket.IO, Pusher)
            e um backend para gerenciar as mensagens.
          </p>
        </div>
      </div>
      <div className="p-4 border-t">
        <form className="flex space-x-2">
          <Textarea placeholder="Digite sua mensagem..." className="flex-1 resize-none" rows={1} />
          <Button type="submit">Enviar</Button>
        </form>
      </div>
    </div>
  )
}
