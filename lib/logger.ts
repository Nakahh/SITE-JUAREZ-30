import prisma from "./prisma";

export async function logActivity(userId: string | null, action: string, details?: string) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || undefined,
        action,
        details,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
  }
}
