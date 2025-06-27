"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface AddToFavoritesButtonProps {
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

export function AddToFavoritesButton({
  propertyData,
}: AddToFavoritesButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!propertyData?.id) return;
    const storedProperties = JSON.parse(
      localStorage.getItem("favoriteProperties") || "[]",
    );
    setIsFavorited(storedProperties.some((p: any) => p.id === propertyData.id));
  }, [propertyData?.id]);

  const handleToggleFavorite = () => {
    if (!propertyData?.id) return;

    let storedProperties = JSON.parse(
      localStorage.getItem("favoriteProperties") || "[]",
    );

    if (isFavorited) {
      storedProperties = storedProperties.filter(
        (p: any) => p.id !== propertyData.id,
      );
    } else {
      storedProperties.push(propertyData);
    }

    localStorage.setItem(
      "favoriteProperties",
      JSON.stringify(storedProperties),
    );
    setIsFavorited(!isFavorited);
  };

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size="icon"
      onClick={handleToggleFavorite}
      className="w-8 h-8 p-0"
      title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-white" : ""}`} />
    </Button>
  );
}

export default AddToFavoritesButton;
