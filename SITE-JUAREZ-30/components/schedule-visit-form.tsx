"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { scheduleVisit } from "@/app/actions/visit-actions"

interface ScheduleVisitFormProps {
  propertyId: string
  propertyTitle: string
}

export function ScheduleVisitForm({ propertyId, propertyTitle }: ScheduleVisitFormProps) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    formData.append("propertyId", propertyId) // Adiciona o ID do imóvel ao FormData

    startTransition(async () => {
      const result = await scheduleVisit(formData)
      if (result.success) {
        setMessage({ type: "success", text: result.message })
        event.currentTarget.reset() // Limpa o formulário
      } else {
        setMessage({ type: "error", text: result.message })
      }
    })
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Agendar Visita para {propertyTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium">
            Seu Nome
          </label>
          <Input type="text" id="clientName" name="clientName" required />
        </div>
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium">
            Seu Email
          </label>
          <Input type="email" id="clientEmail" name="clientEmail" required />
        </div>
        <div>
          <label htmlFor="clientPhone" className="block text-sm font-medium">
            Seu Telefone (Opcional)
          </label>
          <Input type="tel" id="clientPhone" name="clientPhone" />
        </div>
        <div>
          <label htmlFor="dataHora" className="block text-sm font-medium">
            Data e Hora da Visita
          </label>
          <Input type="datetime-local" id="dataHora" name="dataHora" required />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Agendando..." : "Agendar Visita"}
        </Button>
        {message && (
          <p className={`text-sm text-center ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}
