"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscribeToNewsletter } from "@/app/actions/newsletter-actions"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await subscribeToNewsletter(formData)
      if (result.success) {
        setMessage({ type: "success", text: result.message })
        setEmail("") // Limpa o campo após o sucesso
      } else {
        setMessage({ type: "error", text: result.message })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="newsletter-email" className="sr-only">
          Seu Email
        </label>
        <Input
          type="email"
          id="newsletter-email"
          name="email"
          placeholder="Digite seu email para receber novidades"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Inscrevendo..." : "Inscrever-se"}
      </Button>
      {message && (
        <p className={`text-sm text-center ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
          {message.text}
        </p>
      )}
    </form>
  )
}
