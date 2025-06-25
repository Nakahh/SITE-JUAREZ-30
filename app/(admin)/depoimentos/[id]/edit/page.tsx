"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { updateTestimonial } from "@/app/actions/testimonial-actions"
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"

const prisma = new PrismaClient()

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const [testimonial, setTestimonial] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonial = async () => {
      const fetchedTestimonial = await prisma.testimonial.findUnique({
        where: { id: params.id },
      })
      if (!fetchedTestimonial) {
        notFound()
      }
      setTestimonial(fetchedTestimonial)
      setLoading(false)
    }
    fetchTestimonial()
  }, [params.id])

  if (loading) {
    return <p className="text-center text-muted-foreground">Carregando depoimento...</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Depoimento</h1>
      <form action={updateTestimonial.bind(null, testimonial.id)} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium">
            Nome do Autor
          </label>
          <Input type="text" id="authorName" name="authorName" defaultValue={testimonial.authorName} required />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Conteúdo do Depoimento
          </label>
          <Textarea id="content" name="content" defaultValue={testimonial.content} rows={5} required />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium">
            Avaliação (1-5 Estrelas)
          </label>
          <Input type="number" id="rating" name="rating" min="1" max="5" defaultValue={testimonial.rating} required />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="approved" name="approved" defaultChecked={testimonial.approved} />
          <label
            htmlFor="approved"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Aprovado (Visível publicamente)
          </label>
        </div>
        <Button type="submit">Atualizar Depoimento</Button>
      </form>
    </div>
  )
}
