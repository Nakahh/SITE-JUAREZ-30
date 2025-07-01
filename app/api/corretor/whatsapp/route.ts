import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        ativo: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao buscar dados do corretor:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { whatsapp, ativo } = body;

    // Validar dados
    if (typeof ativo !== "boolean") {
      return NextResponse.json(
        { error: "Status ativo deve ser boolean" },
        { status: 400 },
      );
    }

    if (whatsapp && typeof whatsapp !== "string") {
      return NextResponse.json(
        { error: "WhatsApp deve ser uma string" },
        { status: 400 },
      );
    }

    // Validar formato do WhatsApp se fornecido
    if (whatsapp) {
      const phoneRegex = /^55\d{10,11}$/;
      if (!phoneRegex.test(whatsapp)) {
        return NextResponse.json(
          { error: "Formato de WhatsApp inválido. Use 55XXXXXXXXXXX" },
          { status: 400 },
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        whatsapp: whatsapp || null,
        ativo,
      },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        ativo: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar dados do corretor:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
