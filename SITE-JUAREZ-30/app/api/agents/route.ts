import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const agents = await prisma.user.findMany({
      where: {
        papel: "CORRETOR",
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    })
    return NextResponse.json(agents)
  } catch (error) {
    console.error("Erro ao buscar corretores:", error)
    return NextResponse.json({ error: "Erro ao buscar corretores" }, { status: 500 })
  }
}
