"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  toggleFavorite,
  getFavoriteStatus,
} from "@/app/actions/favorite-actions";
import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";

export function AddToFavoritesButton({ propertyId }: { propertyId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      startTransition(async () => {
        const status = await getFavoriteStatus(propertyId);
        setIsFavorited(status);
      });
    }
  }, [propertyId, status]);

  const handleToggleFavorite = () => {
    if (status !== "authenticated") {
      alert("Você precisa estar logado para favoritar imóveis.");
      return;
    }
    startTransition(async () => {
      const result = await toggleFavorite(propertyId);
      if (result.success) {
        setIsFavorited(!isFavorited);
        alert(result.message);
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size="icon"
      onClick={handleToggleFavorite}
      disabled={isPending || status === "loading"}
      className="w-full"
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-white" : ""}`} />
      <span className="ml-2">{isFavorited ? "Favoritado" : "Favoritar"}</span>
      <span className="sr-only">
        {isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      </span>
    </Button>
  );
}

export default AddToFavoritesButton;
