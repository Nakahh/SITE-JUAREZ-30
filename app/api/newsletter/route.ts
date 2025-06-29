
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Verificar se já existe
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Criar novo subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        isActive: true
      }
    });

    // Enviar email de boas-vindas
    await sendEmail({
      to: email,
      subject: "Bem-vindo à Siqueira Campos Imóveis!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a472a 0%, #2d5d3d 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">Siqueira Campos Imóveis</h1>
            <p style="margin: 10px 0 0 0;">Bem-vindo à nossa newsletter!</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a472a;">Olá, ${name || 'Cliente'}!</h2>
            <p>Obrigado por se inscrever em nossa newsletter. Agora você receberá:</p>
            <ul style="color: #2d5d3d;">
              <li>Novos imóveis em destaque</li>
              <li>Dicas do mercado imobiliário</li>
              <li>Ofertas exclusivas</li>
              <li>Notícias do setor</li>
            </ul>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://siqueicamposimoveis.com.br" style="background: #1a472a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Ver Imóveis
              </a>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Siqueira Campos Imóveis - Goiânia/GO</p>
            <p>WhatsApp: (62) 9 8556-3905</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ message: "Inscrito com sucesso!" });
  } catch (error) {
    console.error("Erro ao inscrever newsletter:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("Erro ao buscar subscribers:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
