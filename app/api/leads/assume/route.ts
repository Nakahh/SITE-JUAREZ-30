import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, agentId, message } = body;

    // Validar dados obrigatórios
    if (!leadId || !agentId) {
      return NextResponse.json(
        { error: "leadId e agentId são obrigatórios" },
        { status: 400 },
      );
    }

    // Verificar se a mensagem contém "ASSUMIR"
    if (!message || !message.toLowerCase().includes("assumir")) {
      return NextResponse.json(
        { error: "Mensagem deve conter 'ASSUMIR'" },
        { status: 400 },
      );
    }

    // Verificar se o lead existe e está pendente
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

    if (lead.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "Lead não está mais disponível",
          currentStatus: lead.status,
          currentAgent: lead.agent?.name,
        },
        { status: 409 },
      );
    }

    // Verificar se o corretor existe e está ativo
    const agent = await prisma.user.findUnique({
      where: { id: agentId },
      select: {
        id: true,
        name: true,
        ativo: true,
        whatsapp: true,
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Corretor não encontrado" },
        { status: 404 },
      );
    }

    if (!agent.ativo) {
      return NextResponse.json(
        { error: "Corretor não está ativo" },
        { status: 403 },
      );
    }

    // Atualizar lead como assumido (transação para evitar race condition)
    const updatedLead = await prisma.$transaction(async (tx) => {
      // Verificar novamente se ainda está pendente (double-check locking)
      const currentLead = await tx.lead.findUnique({
        where: { id: leadId },
      });

      if (!currentLead || currentLead.status !== "PENDING") {
        throw new Error("Lead não está mais disponível");
      }

      // Atualizar para assumido
      return await tx.lead.update({
        where: { id: leadId },
        data: {
          status: "ASSUMED",
          agentId,
          assumedAt: new Date(),
        },
        include: {
          agent: {
            select: {
              name: true,
              email: true,
              whatsapp: true,
            },
          },
        },
      });
    });

    // Buscar outros corretores ativos para notificar
    const otherAgents = await prisma.user.findMany({
      where: {
        ativo: true,
        whatsapp: {
          not: null,
        },
        id: {
          not: agentId,
        },
        role: {
          in: ["AGENT", "ADMIN"],
        },
      },
      select: {
        id: true,
        name: true,
        whatsapp: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead assumido com sucesso",
      lead: {
        id: updatedLead.id,
        nome: updatedLead.nome,
        telefone: updatedLead.telefone,
        mensagem: updatedLead.mensagem,
        status: updatedLead.status,
        assumedAt: updatedLead.assumedAt,
        agent: updatedLead.agent,
      },
      notifyAgents: otherAgents,
    });
  } catch (error) {
    console.error("Erro ao assumir lead:", error);

    if (
      error instanceof Error &&
      error.message === "Lead não está mais disponível"
    ) {
      return NextResponse.json(
        { error: "Lead já foi assumido por outro corretor" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
