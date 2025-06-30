"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toggleFavorite } from "@/app/actions/favorite-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EnhancedFavoritesButtonProps {
  propertyId: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function EnhancedFavoritesButton({
  propertyId,
  className,
  size = "sm",
  variant = "ghost",
}: EnhancedFavoritesButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  // Verificar se está nos favoritos (localStorage para não logados)
  useEffect(() => {
    if (!propertyId) return;

    if (session?.user) {
      // Para usuários logados, verificar no servidor
      checkServerFavorite();
    } else {
      // Para usuários não logados, verificar localStorage
      const storedFavorites = JSON.parse(
        localStorage.getItem("favoriteProperties") || "[]",
      );
      setIsFavorited(
        storedFavorites.some((fav: any) => fav.propertyId === propertyId),
      );
    }
  }, [propertyId, session]);

  const checkServerFavorite = async () => {
    if (!session?.user) return;

    try {
      // Aqui você pode implementar uma verificação específica se necessário
      // Por enquanto, vamos assumir que não está favoritado por padrão
      setIsFavorited(false);
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (session?.user) {
        // Usuário logado - usar ação do servidor
        const result = await toggleFavorite(propertyId);

        if (result.success) {
          setIsFavorited(!isFavorited);
          toast.success(
            isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos",
          );
        } else {
          toast.error("Erro ao alterar favorito. Tente novamente.");
        }
      } else {
        // Usuário não logado - usar localStorage
        let storedFavorites = JSON.parse(
          localStorage.getItem("favoriteProperties") || "[]",
        );

        if (isFavorited) {
          // Remover dos favoritos
          storedFavorites = storedFavorites.filter(
            (fav: any) => fav.propertyId !== propertyId,
          );
          toast.success("Removido dos favoritos locais");
        } else {
          // Adicionar aos favoritos
          storedFavorites.push({
            propertyId,
            addedAt: new Date().toISOString(),
          });
          toast.success("Adicionado aos favoritos locais");
        }

        localStorage.setItem(
          "favoriteProperties",
          JSON.stringify(storedFavorites),
        );
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error);
      toast.error("Erro ao alterar favorito. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      // Sugerir login para funcionalidade completa
      toast.info(
        "Faça login para sincronizar seus favoritos em todos os dispositivos",
        {
          action: {
            label: "Fazer Login",
            onClick: () => window.open("/login", "_blank"),
          },
        },
      );
    }

    handleToggleFavorite();
  };

  return (
    <Button
      variant={isFavorited ? "default" : variant}
      size={size === "sm" ? "sm" : "icon"}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "relative transition-all duration-200",
        size === "sm" && "w-8 h-8 p-0",
        isFavorited && "bg-red-500 hover:bg-red-600 text-white",
        !isFavorited &&
          variant === "ghost" &&
          "bg-background/80 hover:bg-background border border-border/50",
        isLoading && "animate-pulse",
        className,
      )}
      title={
        isLoading
          ? "Processando..."
          : isFavorited
            ? "Remover dos favoritos"
            : "Adicionar aos favoritos"
      }
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isFavorited && "fill-current scale-110",
          isLoading && "animate-pulse",
        )}
      />

      {/* Efeito visual quando favorita */}
      {isFavorited && (
        <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" />
      )}
    </Button>
  );
}

export default EnhancedFavoritesButton;
