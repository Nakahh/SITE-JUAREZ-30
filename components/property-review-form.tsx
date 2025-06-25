"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { createPropertyReview } from "@/app/actions/property-review-actions"
import { useToast } from "@/components/ui/use-toast"

interface PropertyReviewFormProps {
  propertyId: string
  userId?: string // Opcional, para saber se o usuário está logado
}

export function PropertyReviewForm({ propertyId, userId }: PropertyReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar uma avaliação.",
        variant: "destructive",
      })
      return
    }
    if (rating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma avaliação em estrelas.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("propertyId", propertyId)
    formData.append("rating", rating.toString())
    formData.append("comment", comment)

    const result = await createPropertyReview(formData)
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      })
      setRating(0)
      setComment("")
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      })
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Deixe sua Avaliação</h3>
      {!userId && (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-primary hover:underline">
            Faça login
          </a>{" "}
          para deixar uma avaliação.
        </p>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            onClick={() => userId && setRating(star)}
            aria-label={`${star} estrelas`}
          />
        ))}
      </div>
      <div>
        <Label htmlFor="comment">Comentário (Opcional)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          disabled={!userId}
        />
      </div>
      <Button type="submit" disabled={isSubmitting || !userId}>
        {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  )
}
