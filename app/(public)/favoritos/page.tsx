"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedPropertyCard } from "@/components/enhanced-property-card";
import { getFavorites } from "@/app/actions/favorite-actions";
import { Heart, LogIn, Trash2, RefreshCw } from "lucide-react";

interface FavoriteProperty {
  id: string;
  propertyId: string;
  property?: {
    id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    status: string;
    address: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    garage: boolean;
    pool?: boolean;
    balcony?: boolean;
    images?: string[] | null;
    createdAt: Date;
    agent?: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
  };
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [localFavorites, setLocalFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [session, status]);

  const loadFavorites = async () => {
    setIsLoading(true);

    if (session?.user) {
      // Usuário logado - carregar favoritos do servidor
      try {
        const serverFavorites = await getFavorites();
        setFavorites(serverFavorites);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    } else {
      // Usuário não logado - carregar do localStorage
      const storedFavorites = JSON.parse(
        localStorage.getItem("favoriteProperties") || "[]",
      );
      setLocalFavorites(storedFavorites);
    }

    setIsLoading(false);
  };

  const clearLocalFavorites = () => {
    localStorage.removeItem("favoriteProperties");
    setLocalFavorites([]);
  };

  const syncLocalFavorites = () => {
    if (session?.user) {
      // Aqui você poderia implementar a sincronização dos favoritos locais com o servidor
      // Por enquanto, apenas limpar os locais
      clearLocalFavorites();
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">
              Carregando seus favoritos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-4xl font-bold tracking-tight">Meus Favoritos</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {session?.user
            ? "Seus imóveis favoritos salvos na sua conta"
            : "Seus imóveis favoritos salvos localmente"}
        </p>
      </div>

      {/* User Status Card */}
      {!session?.user && localFavorites.length > 0 && (
        <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
              <LogIn className="h-5 w-5" />
              <span>Favoritos Locais</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
              Seus favoritos estão salvos apenas neste navegador. Faça login
              para sincronizar em todos os seus dispositivos e nunca perder suas
              seleções.
            </p>
            <div className="flex space-x-3">
              <Button asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login
                </Link>
              </Button>
              <Button variant="outline" onClick={clearLocalFavorites}>
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Favoritos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favoritos do servidor (usuário logado) */}
      {session?.user && (
        <div>
          {favorites.length === 0 ? (
            <Card className="text-center p-12">
              <div className="space-y-4">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Nenhum favorito ainda</h3>
                <p className="text-muted-foreground">
                  Quando você curtir imóveis, eles aparecerão aqui para fácil
                  acesso.
                </p>
                <Button asChild>
                  <Link href="/imoveis">Explorar Imóveis</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {favorites.length}{" "}
                  {favorites.length === 1
                    ? "Imóvel Favoritado"
                    : "Imóveis Favoritados"}
                </h2>
                <Button variant="outline" onClick={loadFavorites}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map(
                  (favorite) =>
                    favorite.property && (
                      <EnhancedPropertyCard
                        key={favorite.id}
                        property={favorite.property}
                      />
                    ),
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Favoritos locais (usuário não logado) */}
      {!session?.user && (
        <div>
          {localFavorites.length === 0 ? (
            <Card className="text-center p-12">
              <div className="space-y-4">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Nenhum favorito ainda</h3>
                <p className="text-muted-foreground">
                  Comece a favoritar imóveis para vê-los aqui. Faça login para
                  sincronizar em todos os dispositivos.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button asChild>
                    <Link href="/imoveis">Explorar Imóveis</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Fazer Login
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {localFavorites.length}{" "}
                  {localFavorites.length === 1
                    ? "Imóvel Favoritado"
                    : "Imóveis Favoritados"}
                  <Badge variant="outline" className="ml-2">
                    Local
                  </Badge>
                </h2>
                <Button variant="outline" onClick={clearLocalFavorites}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Todos
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {localFavorites.map((favorite, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Imóvel ID: {favorite.propertyId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Favoritado em:{" "}
                          {new Date(favorite.addedAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" asChild>
                          <Link href={`/imoveis/${favorite.propertyId}`}>
                            Ver Imóvel
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const updated = localFavorites.filter(
                              (_, i) => i !== index,
                            );
                            setLocalFavorites(updated);
                            localStorage.setItem(
                              "favoriteProperties",
                              JSON.stringify(updated),
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
