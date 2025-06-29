"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

const prisma = new PrismaClient();

export async function scheduleVisit(formData: FormData) {
  const propertyId = formData.get("propertyId") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const notes = formData.get("notes") as string;
  const clientName = formData.get("clientName") as string;
  const clientEmail = formData.get("clientEmail") as string;
  const clientPhone = formData.get("clientPhone") as string;

  if (!propertyId || !date || !time || !clientName || !clientEmail) {
    return {
      success: false,
      message: "Campos obrigatórios: data, hora, nome e email.",
    };
  }

  try {
    const session = await auth();

    // Combinar data e hora
    const visitDateTime = new Date(`${date}T${time}:00`);

    // Verificar se a data não é no passado
    if (visitDateTime < new Date()) {
      return {
        success: false,
        message: "Não é possível agendar visitas para datas passadas.",
      };
    }

    let visitData: any = {
      propertyId,
      date: visitDateTime,
      notes: notes || null,
    };

    if (session?.user?.id) {
      // Usuário logado
      visitData.userId = session.user.id;
    } else {
      // Cliente não logado - criar ou encontrar cliente
      let client = await prisma.client.findUnique({
        where: { email: clientEmail },
      });

      if (!client) {
        client = await prisma.client.create({
          data: {
            name: clientName,
            email: clientEmail,
            phone: clientPhone || null,
          },
        });
      }

      visitData.clientId = client.id;
    }

    const visit = await prisma.visit.create({
      data: visitData,
    });

    await logActivity(
      session?.user?.id || null,
      "scheduleVisit",
      `Visita agendada para imóvel ${propertyId} na data ${visitDateTime.toISOString()}`
    );

    revalidatePath("/admin/visitas");
    revalidatePath("/dashboard/visitas");

    return {
      success: true,
      message:
        "Visita agendada com sucesso! Entraremos em contato para confirmar.",
    };
  } catch (error) {
    console.error("Erro ao agendar visita:", error);
    return {
      success: false,
      message: "Erro ao agendar visita. Tente novamente.",
    };
  }
}

export async function updateVisitStatus(visitId: string, status: string) {
  const session = await auth();

  if (!session?.user?.role || !["ADMIN", "AGENT"].includes(session.user.role)) {
    return { success: false, message: "Permissão negada." };
  }

  try {
    await prisma.visit.update({
      where: { id: visitId },
      data: { status },
    });

    await logActivity(
      session.user.id,
      "updateVisitStatus",
      `Status da visita ${visitId} atualizado para ${status}`
    );

    revalidatePath("/admin/visitas");
    return { success: true, message: "Status da visita atualizado." };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, message: "Erro ao atualizar status." };
  }
}

export async function cancelVisit(visitId: string) {
  const session = await auth();

  try {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { user: true, client: true },
    });

    if (!visit) {
      return { success: false, message: "Visita não encontrada." };
    }

    // Verificar permissão - só o próprio usuário, admin ou agent pode cancelar
    const canCancel =
      session?.user?.id === visit.userId ||
      ["ADMIN", "AGENT"].includes(session?.user?.role || "");

    if (!canCancel) {
      return { success: false, message: "Permissão negada." };
    }

    await prisma.visit.update({
      where: { id: visitId },
      data: { status: "CANCELED" },
    });

    await logActivity(
      session?.user?.id || null,
      "cancelVisit",
      `Visita ${visitId} cancelada`
    );

    revalidatePath("/admin/visitas");
    revalidatePath("/dashboard/visitas");

    return { success: true, message: "Visita cancelada com sucesso." };
  } catch (error) {
    console.error("Erro ao cancelar visita:", error);
    return { success: false, message: "Erro ao cancelar visita." };
  }
}