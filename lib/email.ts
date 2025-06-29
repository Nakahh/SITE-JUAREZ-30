import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY não configurado, email não enviado')
      return { success: false, error: 'Email não configurado' }
    }

    const result = await resend.emails.send({
      from: options.from || 'noreply@siqueiracamposimoveis.com.br',
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}

export function generateContactEmailTemplate(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Novo Contato - Siqueira Campos Imóveis</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Novo Contato Recebido</h2>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Dados do Contato:</h3>
          <p><strong>Nome:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Telefone:</strong> ${data.phone}</p>` : ''}
          <p><strong>Assunto:</strong> ${data.subject}</p>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="margin-top: 0;">Mensagem:</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #0369a1;">
            Este email foi enviado automaticamente pelo site Siqueira Campos Imóveis.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getVisitConfirmationEmailHtml(
  clientName: string,
  propertyName: string,
  visitDateTime: string,
  propertyLink: string,
) {
  return `
    <h1>Confirmação de Agendamento de Visita</h1>
    <p>Olá, ${clientName}!</p>
    <p>Sua visita para o imóvel <strong>${propertyName}</strong> foi agendada com sucesso para <strong>${visitDateTime}</strong>.</p>
    <p>Aguardamos você!</p>
    <p>Detalhes do imóvel: <a href="${propertyLink}">${propertyLink}</a></p>
    <p>Atenciosamente,</p>
    <p>Sua Imobiliária</p>
  `
}

export function getContactConfirmationEmailHtml(clientName: string, clientEmail: string, message: string) {
  return `
    <h1>Confirmação de Contato Recebido</h1>
    <p>Olá, ${clientName}!</p>
    <p>Recebemos sua mensagem e entraremos em contato em breve.</p>
    <p>Sua mensagem:</p>
    <p>"${message}"</p>
    <p>Atenciosamente,</p>
    <p>Sua Imobiliária</p>
  `
}

export function getNewLeadNotificationEmailHtml(
  leadName: string,
  leadEmail: string,
  leadPhone: string,
  message: string,
  type: string,
) {
  return `
    <h1>Novo Contato Recebido (Lead)</h1>
    <p>Um novo contato foi recebido através do site:</p>
    <ul>
      <li><strong>Nome:</strong> ${leadName}</li>
      <li><strong>Email:</strong> ${leadEmail}</li>
      <li><strong>Telefone:</strong> ${leadPhone || "N/A"}</li>
      <li><strong>Tipo de Contato:</strong> ${type}</li>
    </ul>
    <p><strong>Mensagem:</strong></p>
    <p>"${message}"</p>
    <p>Por favor, entre em contato com o lead o mais rápido possível.</p>
  `
}

export function getPropertyAlertEmailHtml(userName: string, newProperties: any[], searchParams: any) {
  const propertiesListHtml = newProperties
    .map(
      (prop) => `
    <li>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/imoveis/${prop.id}">
        <strong>${prop.titulo}</strong> - ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prop.preco)}
      </a> em ${prop.localizacao}
    </li>
  `,
    )
    .join("")

  return `
    <h1>Novos Imóveis para Você, ${userName}!</h1>
    <p>Encontramos novos imóveis que correspondem aos seus critérios de busca:</p>
    <p><strong>Seus critérios:</strong> ${JSON.stringify(searchParams)}</p>
    <ul>
      ${propertiesListHtml}
    </ul>
    <p>Visite nosso site para mais detalhes!</p>
    <p>Atenciosamente,</p>
    <p>Sua Imobiliária</p>
  `
}