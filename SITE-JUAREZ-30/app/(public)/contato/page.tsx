"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Importar Select
import { createContact } from "@/app/actions/contact-actions"
import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

export default function ContactPage() {
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const result = await createContact(formData)
    setResponse(result)
    if (result.success) {
      // Limpar formulário após sucesso
      const form = document.getElementById("contact-form") as HTMLFormElement
      form.reset()
    }
  }

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight text-center mb-10">Entre em Contato Conosco</h1>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <p className="text-center text-muted-foreground mb-6">
          Preencha o formulário abaixo e entraremos em contato o mais breve possível.
        </p>
        <form id="contact-form" action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium">
              Seu Nome
            </label>
            <Input type="text" id="nome" name="nome" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Seu E-mail
            </label>
            <Input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium">
              Seu Telefone (Opcional)
            </label>
            <Input type="tel" id="telefone" name="telefone" />
          </div>
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium">
              Assunto
            </label>
            <Select name="tipo" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de contato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Geral">Informações Gerais</SelectItem>
                <SelectItem value="Imovel">Interesse em Imóvel</SelectItem>
                <SelectItem value="Visita">Agendamento de Visita</SelectItem>
                <SelectItem value="Parceria">Parceria</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium">
              Sua Mensagem
            </label>
            <Textarea id="mensagem" name="mensagem" rows={5} required />
          </div>
          <Button type="submit" className="w-full">
            Enviar Mensagem
          </Button>
          {response && (
            <div
              className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
                response.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {response.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {response.message}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
