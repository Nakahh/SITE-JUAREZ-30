"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createArticleComment } from "@/app/actions/article-comment-actions"
import { useToast } from "@/components/ui/use-toast"

interface ArticleCommentFormProps {
  articleId: string
  userId?: string // Opcional, para saber se o usuário está logado
}

export function ArticleCommentForm({ articleId, userId }: ArticleCommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para comentar.",
        variant: "destructive",
      })
      return
    }
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "O comentário não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("articleId", articleId)
    formData.append("content", content)

    const result = await createArticleComment(formData)
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      })
      setContent("")
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
      <h3 className="text-lg font-semibold">Deixe seu Comentário</h3>
      {!userId && (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-primary hover:underline">
            Faça login
          </a>{" "}
          para deixar um comentário.
        </p>
      )}
      <div>
        <Label htmlFor="comment-content">Seu Comentário</Label>
        <Textarea
          id="comment-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
          disabled={!userId}
        />
      </div>
      <Button type="submit" disabled={isSubmitting || !userId}>
        {isSubmitting ? "Enviando..." : "Enviar Comentário"}
      </Button>
    </form>
  )
}
