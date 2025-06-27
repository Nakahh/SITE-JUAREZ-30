import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!resend) {
    console.warn("RESEND_API_KEY não configurada. E-mail não enviado. Conteúdo do e-mail:", { to, subject, html, text })
    return { success: false, message: "RESEND_API_KEY não configurada." }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Imobiliária <onboarding@resend.dev>", // Substitua pelo seu domínio verificado no Resend
      to: [to],
      subject,
      html,
      text,
    })

    if (error) {
      console.error("Erro ao enviar e-mail com Resend:", error)
      return { success: false, message: error.message }
    }

    console.log("E-mail enviado com sucesso:", data)
    return { success: true, message: "E-mail enviado com sucesso!" }
  } catch (error) {
    console.error("Erro inesperado ao enviar e-mail:", error)
    return { success: false, message: "Erro inesperado ao enviar e-mail." }
  }
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
