import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, telefone, mensagem } = body;

    // Validar dados obrigatórios
    if (!nome || !telefone || !mensagem) {
      return NextResponse.json(
        { error: "Nome, telefone e mensagem são obrigatórios" },
        { status: 400 },
      );
    }

    // Limpar e validar telefone
    const cleanPhone = telefone.replace(/\D/g, "");
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Formato de telefone inválido" },
        { status: 400 },
      );
    }

    // Buscar corretores ativos
    const activeAgents = await prisma.user.findMany({
      where: {
        ativo: true,
        whatsapp: {
          not: null,
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

    if (activeAgents.length === 0) {
      // Nenhum corretor ativo - salvar lead como não atribuído
      const lead = await prisma.lead.create({
        data: {
          nome,
          telefone: cleanPhone,
          mensagem,
          status: "EXPIRED",
          expiredAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        leadId: lead.id,
        message: "Nenhum corretor ativo disponível",
        agents: [],
      });
    }

    // Criar lead pendente
    const lead = await prisma.lead.create({
      data: {
        nome,
        telefone: cleanPhone,
        mensagem,
        status: "PENDING",
      },
    });

    // Retornar dados para o N8N processar
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      lead: {
        id: lead.id,
        nome,
        telefone: cleanPhone,
        mensagem,
      },
      agents: activeAgents,
      message: `Lead encaminhado para ${activeAgents.length} corretor(es) ativo(s)`,
    });
  } catch (error) {
    console.error("Erro ao processar lead:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
