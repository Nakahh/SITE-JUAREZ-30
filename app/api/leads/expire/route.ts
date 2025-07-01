import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, reason } = body;

    // Validar dados obrigatórios
    if (!leadId) {
      return NextResponse.json(
        { error: "leadId é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se o lead existe
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        agent: {
          select: {
            name: true,
            whatsapp: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead não encontrado" },
        { status: 404 },
      );
    }

    // Só pode expirar leads pendentes
    if (lead.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "Lead não está pendente",
          currentStatus: lead.status,
        },
        { status: 409 },
      );
    }

    // Atualizar lead como expirado
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "EXPIRED",
        expiredAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead expirado",
      lead: {
        id: updatedLead.id,
        nome: updatedLead.nome,
        telefone: updatedLead.telefone,
        mensagem: updatedLead.mensagem,
        status: updatedLead.status,
        expiredAt: updatedLead.expiredAt,
      },
      reason: reason || "Timeout de 15 minutos",
    });
  } catch (error) {
    console.error("Erro ao expirar lead:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

// API para expirar leads automaticamente (pode ser chamada por cron)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxAge = parseInt(searchParams.get("maxAge") || "15"); // 15 minutos por padrão

    const cutoffTime = new Date(Date.now() - maxAge * 60 * 1000);

    // Buscar leads pendentes que passaram do tempo limite
    const expiredLeads = await prisma.lead.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          lt: cutoffTime,
        },
      },
    });

    if (expiredLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nenhum lead pendente para expirar",
        expired: 0,
      });
    }

    // Atualizar todos para expirado
    const result = await prisma.lead.updateMany({
      where: {
        id: {
          in: expiredLeads.map((lead) => lead.id),
        },
      },
      data: {
        status: "EXPIRED",
        expiredAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} leads expirados automaticamente`,
      expired: result.count,
      leads: expiredLeads.map((lead) => ({
        id: lead.id,
        nome: lead.nome,
        telefone: lead.telefone,
        createdAt: lead.createdAt,
      })),
    });
  } catch (error) {
    console.error("Erro ao expirar leads automaticamente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
