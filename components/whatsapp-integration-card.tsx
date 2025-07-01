"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import {
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Users,
  Clock,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface UserData {
  whatsapp?: string;
  ativo: boolean;
}

export function WhatsAppIntegrationCard() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData>({ ativo: true });
  const [whatsapp, setWhatsapp] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session?.user?.id]);

  const fetchUserData = async () => {
    try {
      setIsFetching(true);
      const response = await fetch("/api/corretor/whatsapp");
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setWhatsapp(data.whatsapp || "");
        setAtivo(data.ativo || false);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsFetching(false);
    }
  };

  const formatWhatsApp = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format as (XX) 9 XXXX-XXXX
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 7)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (value: string) => {
    const formatted = formatWhatsApp(value);
    setWhatsapp(formatted);
  };

  const validateWhatsApp = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return (
      (digits.length === 11 && digits.startsWith("11")) || digits.length === 11
    );
  };

  const handleSave = async () => {
    if (whatsapp && !validateWhatsApp(whatsapp)) {
      toast.error(
        "Número de WhatsApp inválido. Use o formato (XX) 9 XXXX-XXXX",
      );
      return;
    }

    setIsLoading(true);
    try {
      const cleanPhone = whatsapp.replace(/\D/g, "");
      const formattedPhone = cleanPhone ? `55${cleanPhone}` : null;

      const response = await fetch("/api/corretor/whatsapp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: formattedPhone,
          ativo,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setLastSaved(new Date());
        toast.success("Configurações salvas com sucesso!");
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (ativo && whatsapp) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Online - Recebendo Leads
        </Badge>
      );
    } else if (ativo && !whatsapp) {
      return (
        <Badge variant="outline" className="border-orange-200 text-orange-800">
          Configure o WhatsApp
        </Badge>
      );
    } else {
      return <Badge variant="secondary">Offline - Não recebendo leads</Badge>;
    }
  };

  if (isFetching) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <CardTitle>Carregando...</CardTitle>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <WhatsAppIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Integração WhatsApp</CardTitle>
              <CardDescription>
                Configure seu WhatsApp para receber leads automaticamente
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Como funciona:</strong> Quando você estiver ATIVO, receberá
            automaticamente os leads capturados pela nossa assistente IA.
            Responda com{" "}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
              ASSUMIR
            </code>{" "}
            para ficar responsável pelo atendimento.
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* WhatsApp Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-sm font-medium">
              Número do WhatsApp
            </Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                placeholder="(62) 9 8556-3905"
                className="pl-10 text-lg font-mono"
                maxLength={16}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Digite apenas números. O formato será aplicado automaticamente.
            </p>
          </div>

          <Separator />

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="ativo" className="text-sm font-medium">
                  Status para receber leads
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                {ativo
                  ? "Você está disponível para receber novos leads"
                  : "Você não receberá novos leads"}
              </p>
            </div>
            <Switch
              id="ativo"
              checked={ativo}
              onCheckedChange={setAtivo}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-muted-foreground">
            {lastSaved && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Salvo em {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-background/50 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-semibold flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Como receber e assumir leads:</span>
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start space-x-2">
              <div className="h-1.5 w-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Mantenha seu status ATIVO quando estiver disponível</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="h-1.5 w-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                Você receberá uma mensagem no WhatsApp com os dados do lead
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="h-1.5 w-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                Responda com "ASSUMIR" para ficar responsável pelo atendimento
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                O primeiro a responder fica com o lead (máximo 15 minutos)
              </span>
            </div>
          </div>
        </div>

        {/* Test WhatsApp */}
        {whatsapp && ativo && (
          <Button
            variant="outline"
            className="w-full border-green-200 text-green-700 hover:bg-green-50"
            asChild
          >
            <a
              href={`https://wa.me/${userData.whatsapp?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="mr-2 h-4 w-4" />
              Testar WhatsApp
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
