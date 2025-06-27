"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RatioIcon as Balance } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AddToCompareButtonProps {
  propertyData: {
    id: string;
    titulo: string;
    preco: number;
    tipo: string;
    quartos: number;
    area: number;
    localizacao: string;
    imageUrl: string;
  };
}

export function AddToCompareButton({ propertyData }: AddToCompareButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!propertyData?.id) return;
    const storedProperties = JSON.parse(
      localStorage.getItem("comparedProperties") || "[]",
    );
    setIsAdded(storedProperties.some((p: any) => p.id === propertyData.id));
  }, [propertyData?.id]);

  const handleToggleCompare = () => {
    if (!propertyData?.id) return;

    let storedProperties = JSON.parse(
      localStorage.getItem("comparedProperties") || "[]",
    );

    if (isAdded) {
      // Remove from compare
      storedProperties = storedProperties.filter(
        (p: any) => p.id !== propertyData.id,
      );
      toast({
        title: "Removido do Comparador",
        description: `${propertyData.titulo} foi removido da sua lista de comparação.`,
      });
    } else {
      // Add to compare
      if (storedProperties.length >= 4) {
        toast({
          title: "Limite Atingido",
          description: "Você pode comparar no máximo 4 imóveis por vez.",
          variant: "destructive",
        });
        return;
      }
      storedProperties.push(propertyData);
      toast({
        title: "Adicionado ao Comparador",
        description: `${propertyData.titulo} foi adicionado à sua lista de comparação.`,
      });
    }

    localStorage.setItem(
      "comparedProperties",
      JSON.stringify(storedProperties),
    );
    setIsAdded(!isAdded);
    router.refresh();
  };

  return (
    <Button
      variant={isAdded ? "secondary" : "outline"}
      size="icon"
      onClick={handleToggleCompare}
      className="w-8 h-8 p-0"
      title={isAdded ? "Remover do Comparador" : "Adicionar ao Comparador"}
    >
      <Balance className="h-4 w-4" />
    </Button>
  );
}
