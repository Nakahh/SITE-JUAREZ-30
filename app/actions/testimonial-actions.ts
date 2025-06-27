"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function createTestimonial(formData: FormData) {
  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string);

  if (!content || !rating || rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Conteúdo e avaliação (1-5 estrelas) são obrigatórios.",
    };
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Você precisa estar logado para enviar um depoimento.",
      };
    }

    // Verificar se o usuário já enviou um depoimento
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: { userId: session.user.id },
    });

    if (existingTestimonial) {
      return {
        success: false,
        message:
          "Você já enviou um depoimento. Cada usuário pode enviar apenas um.",
      };
    }

    await prisma.testimonial.create({
      data: {
        content,
        rating,
        userId: session.user.id,
        approved: false, // Requer aprovação do admin
      },
    });

    revalidatePath("/depoimentos");
    revalidatePath("/admin/depoimentos");

    return {
      success: true,
      message:
        "Depoimento enviado com sucesso! Será analisado e publicado após aprovação.",
    };
  } catch (error) {
    console.error("Erro ao criar depoimento:", error);
    return {
      success: false,
      message: "Erro ao enviar depoimento. Tente novamente.",
    };
  }
}

export async function approveTestimonial(testimonialId: string) {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return {
      success: false,
      message:
        "Permissão negada. Apenas administradores podem aprovar depoimentos.",
    };
  }

  try {
    await prisma.testimonial.update({
      where: { id: testimonialId },
      data: { approved: true },
    });

    revalidatePath("/depoimentos");
    revalidatePath("/admin/depoimentos");

    return { success: true, message: "Depoimento aprovado com sucesso!" };
  } catch (error) {
    console.error("Erro ao aprovar depoimento:", error);
    return { success: false, message: "Erro ao aprovar depoimento." };
  }
}

export async function deleteTestimonial(testimonialId: string) {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return { success: false, message: "Permissão negada." };
  }

  try {
    await prisma.testimonial.delete({
      where: { id: testimonialId },
    });

    revalidatePath("/depoimentos");
    revalidatePath("/admin/depoimentos");

    return { success: true, message: "Depoimento excluído com sucesso!" };
  } catch (error) {
    console.error("Erro ao excluir depoimento:", error);
    return { success: false, message: "Erro ao excluir depoimento." };
  }
}
