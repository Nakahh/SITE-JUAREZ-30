"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProperty } from "@/app/actions/property-actions"
import { ImageUpload } from "@/components/image-upload"
import { useState, useEffect } from "react"
import { PrismaClient, type User } from "@prisma/client"

const prisma = new PrismaClient()

export default function NewPropertyPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [agents, setAgents] = useState<User[]>([])
  const [loadingAgents, setLoadingAgents] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      setLoadingAgents(true)
      const response = await fetch("/api/agents") // Criaremos esta API route
      const data = await response.json()
      setAgents(data)
      setLoadingAgents(false)
    }
    fetchAgents()
  }, [])

  const handleSubmit = async (formData: FormData) => {
    // Adiciona as URLs das imagens ao FormData
    imageUrls.forEach((url) => {
      formData.append("imageUrls[]", url)
    })
    await createProperty(formData)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Imóvel</h1>
      <form action={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium">
            Título
          </label>
          <Input type="text" id="titulo" name="titulo" required />
        </div>
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium">
            Descrição
          </label>
          <Textarea id="descricao" name="descricao" rows={5} />
        </div>
        <div>
          <label htmlFor="preco" className="block text-sm font-medium">
            Preço (R$)
          </label>
          <Input type="number" id="preco" name="preco" step="0.01" required />
        </div>
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium">
            Tipo
          </label>
          <Select name="tipo" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartamento">Apartamento</SelectItem>
              <SelectItem value="Casa">Casa</SelectItem>
              <SelectItem value="Terreno">Terreno</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="quartos" className="block text-sm font-medium">
            Quartos
          </label>
          <Input type="number" id="quartos" name="quartos" required />
        </div>
        <div>
          <label htmlFor="area" className="block text-sm font-medium">
            Área (m²)
          </label>
          <Input type="number" id="area" name="area" step="0.01" required />
        </div>
        <div>
          <label htmlFor="localizacao" className="block text-sm font-medium">
            Localização
          </label>
          <Input type="text" id="localizacao" name="localizacao" required />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <Select name="status" defaultValue="Disponível" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponível">Disponível</SelectItem>
              <SelectItem value="Vendido">Vendido</SelectItem>
              <SelectItem value="Alugado">Alugado</SelectItem>
              <SelectItem value="Em Negociação">Em Negociação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="agentId" className="block text-sm font-medium">
            Corretor Responsável
          </label>
          <Select name="agentId" disabled={loadingAgents}>
            <SelectTrigger>
              <SelectValue
                placeholder={loadingAgents ? "Carregando corretores..." : "Selecione um corretor (Opcional)"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum Corretor</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.nome} ({agent.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="comodidades" className="block text-sm font-medium">
            Comodidades (separadas por vírgula)
          </label>
          <Input type="text" id="comodidades" name="comodidades" placeholder="Ex: Piscina, Academia, Churrasqueira" />
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium mb-2">
            Imagens do Imóvel
          </label>
          <ImageUpload onImageUpload={setImageUrls} initialImageUrls={imageUrls} />
        </div>
        <Button type="submit">Salvar Imóvel</Button>
      </form>
    </div>
  )
}
