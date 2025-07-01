import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Construir filtros
    const where: any = {
      agentId: session.user.id,
    };

    if (
      status &&
      ["PENDING", "ASSUMED", "EXPIRED", "REJECTED"].includes(status)
    ) {
      where.status = status;
    }

    const leads = await prisma.lead.findMany({
      where,
      select: {
        id: true,
        nome: true,
        telefone: true,
        mensagem: true,
        respostaIa: true,
        status: true,
        createdAt: true,
        assumedAt: true,
        expiredAt: true,
        agent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    // Buscar estatísticas
    const stats = await prisma.lead.groupBy({
      by: ["status"],
      where: { agentId: session.user.id },
      _count: {
        _all: true,
      },
    });

    const statsMap = stats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count._all;
        return acc;
      },
      {} as Record<string, number>,
    );

    return NextResponse.json({
      leads,
      stats: {
        total: Object.values(statsMap).reduce((sum, count) => sum + count, 0),
        pending: statsMap.PENDING || 0,
        assumed: statsMap.ASSUMED || 0,
        expired: statsMap.EXPIRED || 0,
        rejected: statsMap.REJECTED || 0,
      },
      pagination: {
        limit,
        offset,
        hasMore: leads.length === limit,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar leads:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, telefone, mensagem, respostaIa } = body;

    // Validar dados obrigatórios
    if (!nome || !telefone || !mensagem) {
      return NextResponse.json(
        { error: "Nome, telefone e mensagem são obrigatórios" },
        { status: 400 },
      );
    }

    // Validar formato do telefone
    const phoneRegex = /^\d{10,11}$/;
    const cleanPhone = telefone.replace(/\D/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Formato de telefone inválido" },
        { status: 400 },
      );
    }

    const lead = await prisma.lead.create({
      data: {
        nome,
        telefone: cleanPhone,
        mensagem,
        respostaIa,
        agentId: session.user.id,
        status: "PENDING",
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
        mensagem: true,
        respostaIa: true,
        status: true,
        createdAt: true,
        assumedAt: true,
        expiredAt: true,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lead:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
