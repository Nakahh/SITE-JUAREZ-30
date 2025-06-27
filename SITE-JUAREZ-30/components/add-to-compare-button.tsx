"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RatioIcon as Balance } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AddToCompareButtonProps {
  property: {
    id: string
    titulo: string
    preco: number
    tipo: string
    quartos: number
    area: number
    localizacao: string
    imageUrls?: string[]
    comodidades?: string[]
    descricao?: string
  }
}

export function AddToCompareButton({ property }: AddToCompareButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const storedProperties = JSON.parse(localStorage.getItem("comparedProperties") || "[]")
    setIsAdded(storedProperties.some((p: any) => p.id === property.id))
  }, [property.id])

  const handleToggleCompare = () => {
    let storedProperties = JSON.parse(localStorage.getItem("comparedProperties") || "[]")

    if (isAdded) {
      // Remove from compare
      storedProperties = storedProperties.filter((p: any) => p.id !== property.id)
      toast({
        title: "Removido do Comparador",
        description: `${property.titulo} foi removido da sua lista de comparação.`,
      })
    } else {
      // Add to compare
      if (storedProperties.length >= 4) {
        toast({
          title: "Limite Atingido",
          description: "Você pode comparar no máximo 4 imóveis por vez.",
          variant: "destructive",
        })
        return
      }
      storedProperties.push(property)
      toast({
        title: "Adicionado ao Comparador",
        description: `${property.titulo} foi adicionado à sua lista de comparação.`,
      })
    }

    localStorage.setItem("comparedProperties", JSON.stringify(storedProperties))
    setIsAdded(!isAdded)
    router.refresh() // Força a re-renderização para atualizar o estado do botão em outras páginas
  }

  return (
    <Button variant={isAdded ? "secondary" : "outline"} className="flex-1" onClick={handleToggleCompare}>
      <Balance className="h-4 w-4 mr-2" />
      {isAdded ? "Remover do Comparador" : "Adicionar ao Comparador"}
    </Button>
  )
}
