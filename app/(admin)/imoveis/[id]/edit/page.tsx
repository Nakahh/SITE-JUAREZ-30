"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProperty } from "@/app/actions/property-actions";
import { PrismaClient, type User } from "@prisma/client"; // Adicionado User
import { notFound } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";
import { useState, useEffect } from "react";

const prisma = new PrismaClient();

export default function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const [property, setProperty] = useState<any | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<User[]>([]); // Novo estado para corretores
  const [loadingAgents, setLoadingAgents] = useState(true); // Novo estado para carregamento de corretores

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingAgents(true);

      // Fetch property
      const fetchedProperty = await prisma.property.findUnique({
        where: { id: params.id },
      });
      if (!fetchedProperty) {
        notFound();
      }
      setProperty(fetchedProperty);
      setImageUrls(
        Array.isArray(fetchedProperty.images) ? fetchedProperty.images : [],
      );

      // Fetch agents
      const response = await fetch("/api/agents");
      const data = await response.json();
      setAgents(data);
      setLoadingAgents(false);
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  const handleSubmit = async (formData: FormData) => {
    imageUrls.forEach((url) => {
      formData.append("imageUrls[]", url);
    });
    await updateProperty(property.id, formData);
  };

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">Carregando imóvel...</p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Imóvel</h1>
      <form action={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium">
            Título
          </label>
          <Input
            type="text"
            id="titulo"
            name="titulo"
            defaultValue={property.title}
            required
          />
        </div>
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium">
            Descrição
          </label>
          <Textarea
            id="descricao"
            name="descricao"
            defaultValue={property.description || ""}
            rows={5}
          />
        </div>
        <div>
          <label htmlFor="preco" className="block text-sm font-medium">
            Preço (R$)
          </label>
          <Input
            type="number"
            id="preco"
            name="preco"
            step="0.01"
            defaultValue={property.price.toString()}
            required
          />
        </div>
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium">
            Tipo
          </label>
          <Select name="tipo" defaultValue={property.type} required>
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
          <Input
            type="number"
            id="quartos"
            name="quartos"
            defaultValue={property.quartos}
            required
          />
        </div>
        <div>
          <label htmlFor="area" className="block text-sm font-medium">
            Área (m²)
          </label>
          <Input
            type="number"
            id="area"
            name="area"
            step="0.01"
            defaultValue={property.area}
            required
          />
        </div>
        <div>
          <label htmlFor="localizacao" className="block text-sm font-medium">
            Localização
          </label>
          <Input
            type="text"
            id="localizacao"
            name="localizacao"
            defaultValue={property.localizacao}
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <Select name="status" defaultValue={property.status} required>
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
          <Select
            name="agentId"
            defaultValue={property.agentId || ""}
            disabled={loadingAgents}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingAgents
                    ? "Carregando corretores..."
                    : "Selecione um corretor (Opcional)"
                }
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
          <Input
            type="text"
            id="comodidades"
            name="comodidades"
            defaultValue={property.comodidades?.join(", ") || ""}
            placeholder="Ex: Piscina, Academia, Churrasqueira"
          />
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium mb-2">
            Imagens do Imóvel
          </label>
          <ImageUpload
            onImageUpload={setImageUrls}
            initialImageUrls={imageUrls}
          />
        </div>
        <Button type="submit">Atualizar Imóvel</Button>
      </form>
    </div>
  );
}
