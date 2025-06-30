"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { scheduleVisit } from "@/app/actions/visit-actions";
import { toast } from "sonner";

interface VisitScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    address: string;
    city: string;
    state: string;
  };
}

export function VisitScheduleDialog({
  isOpen,
  onClose,
  property,
}: VisitScheduleDialogProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
    clientName: session?.user?.name || "",
    clientEmail: session?.user?.email || "",
    clientPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("propertyId", property.id);
      submitFormData.append("date", formData.date);
      submitFormData.append("time", formData.time);
      submitFormData.append("notes", formData.notes);
      submitFormData.append("clientName", formData.clientName);
      submitFormData.append("clientEmail", formData.clientEmail);
      submitFormData.append("clientPhone", formData.clientPhone);

      const result = await scheduleVisit(submitFormData);

      if (result.success) {
        toast.success(result.message);
        onClose();
        setFormData({
          date: "",
          time: "",
          notes: "",
          clientName: session?.user?.name || "",
          clientEmail: session?.user?.email || "",
          clientPhone: "",
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao agendar visita. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Gerar horários disponíveis (9h às 17h, de hora em hora)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 17) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }

  // Data mínima (amanhã)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Agendar Visita</span>
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-1">
              <p className="font-medium">{property.title}</p>
              <p className="text-sm text-muted-foreground">
                {property.address}, {property.city} - {property.state}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Data</span>
              </Label>
              <Input
                id="date"
                type="date"
                min={minDate}
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Horário</span>
              </Label>
              <select
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dados do cliente (se não logado) */}
          {!session && (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="clientName"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Nome completo</span>
                </Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.clientName}
                  onChange={(e) =>
                    handleInputChange("clientName", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="clientEmail"
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>E-mail</span>
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    handleInputChange("clientEmail", e.target.value)
                  }
                  required
                />
              </div>
            </>
          )}

          {/* Telefone (sempre obrigatório) */}
          <div className="space-y-2">
            <Label
              htmlFor="clientPhone"
              className="flex items-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Telefone/WhatsApp</span>
            </Label>
            <Input
              id="clientPhone"
              type="tel"
              placeholder="(62) 9 9999-9999"
              value={formData.clientPhone}
              onChange={(e) => handleInputChange("clientPhone", e.target.value)}
              required
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Observações (opcional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Alguma informação adicional sobre a visita..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Agendando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Visita
                </>
              )}
            </Button>
          </DialogFooter>
        </form>

        {/* Informações adicionais */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Importante:</strong> Após o agendamento, nossa equipe
            entrará em contato para confirmar a visita. Horário de
            funcionamento: Segunda à Sexta das 8h às 18h, Sábado das 8h às 14h.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VisitScheduleDialog;
