import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const agents = await prisma.user.findMany({
      where: {
        role: "AGENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Erro ao buscar agentes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agentes" },
      { status: 500 },
    );
  }
}
