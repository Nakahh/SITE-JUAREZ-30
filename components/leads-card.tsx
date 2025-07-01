"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MessageSquare,
  Loader2,
  Calendar,
  Filter,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  mensagem: string;
  respostaIa?: string;
  status: "PENDING" | "ASSUMED" | "EXPIRED" | "REJECTED";
  createdAt: string;
  assumedAt?: string;
  expiredAt?: string;
}

export function LeadsCard() {
  const { data: session } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "PENDING" | "ASSUMED" | "EXPIRED"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    if (session?.user?.id) {
      fetchLeads();
    }
  }, [session?.user?.id]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/corretor/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        throw new Error("Erro ao carregar leads");
      }
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      toast.error("Erro ao carregar leads");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Lead["status"]) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "ASSUMED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "EXPIRED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-orange-200 text-orange-800 bg-orange-50"
          >
            Pendente
          </Badge>
        );
      case "ASSUMED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Assumido
          </Badge>
        );
      case "EXPIRED":
        return <Badge variant="destructive">Expirado</Badge>;
      case "REJECTED":
        return <Badge variant="secondary">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusDescription = (status: Lead["status"]) => {
    switch (status) {
      case "PENDING":
        return "Aguardando resposta dos corretores";
      case "ASSUMED":
        return "Lead assumido por você";
      case "EXPIRED":
        return "Nenhum corretor respondeu em 15 minutos";
      case "REJECTED":
        return "Lead rejeitado";
      default:
        return "";
    }
  };

  const filteredAndSortedLeads = leads
    .filter((lead) => filter === "all" || lead.status === filter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  const statusCounts = {
    total: leads.length,
    pending: leads.filter((l) => l.status === "PENDING").length,
    assumed: leads.filter((l) => l.status === "ASSUMED").length,
    expired: leads.filter((l) => l.status === "EXPIRED").length,
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <CardTitle>Carregando leads...</CardTitle>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Meus Leads</span>
            </CardTitle>
            <CardDescription>
              Gerencie e acompanhe seus leads recebidos
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLeads}>
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {statusCounts.total}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {statusCounts.pending}
            </div>
            <div className="text-xs text-muted-foreground">Pendentes</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.assumed}
            </div>
            <div className="text-xs text-muted-foreground">Assumidos</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.expired}
            </div>
            <div className="text-xs text-muted-foreground">Expirados</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="ASSUMED">Assumidos</SelectItem>
                <SelectItem value="EXPIRED">Expirados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAndSortedLeads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === "all"
                ? "Nenhum lead encontrado"
                : `Nenhum lead ${filter.toLowerCase()}`}
            </h3>
            <p className="text-muted-foreground">
              {filter === "all"
                ? "Você ainda não recebeu nenhum lead. Certifique-se de que seu status está ativo."
                : "Tente alterar os filtros para ver outros leads."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedLeads.map((lead, index) => (
              <div key={lead.id}>
                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(lead.status)}
                      <div>
                        <h4 className="font-semibold">{lead.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(lead.createdAt),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR },
                          )}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(lead.status)}
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{lead.telefone}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        asChild
                      >
                        <a
                          href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>

                    {lead.assumedAt && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          Assumido em{" "}
                          {format(
                            new Date(lead.assumedAt),
                            "dd/MM 'às' HH:mm",
                            { locale: ptBR },
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Mensagem do cliente:
                      </span>
                    </div>
                    <p className="text-sm bg-background p-3 rounded border-l-4 border-primary/20">
                      "{lead.mensagem}"
                    </p>
                  </div>

                  {/* IA Response */}
                  {lead.respostaIa && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                        <span className="text-sm font-medium">
                          Resposta da IA:
                        </span>
                      </div>
                      <p className="text-sm bg-blue-50 dark:bg-blue-950/20 p-3 rounded border-l-4 border-blue-500/20">
                        {lead.respostaIa}
                      </p>
                    </div>
                  )}

                  {/* Status Description */}
                  <div className="text-xs text-muted-foreground">
                    {getStatusDescription(lead.status)}
                  </div>
                </div>

                {index < filteredAndSortedLeads.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
