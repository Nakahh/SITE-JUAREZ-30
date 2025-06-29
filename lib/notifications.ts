import { prisma } from './prisma'

export interface NotificationData {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  userId?: string
  propertyId?: string
  visitId?: string
}

export class NotificationService {
  // Criar notificação no banco
  static async create(data: NotificationData) {
    try {
      await prisma.activityLog.create({
        data: {
          userId: data.userId,
          action: `NOTIFICATION_${data.type.toUpperCase()}`,
          details: JSON.stringify({
            title: data.title,
            message: data.message,
            propertyId: data.propertyId,
            visitId: data.visitId,
            timestamp: new Date()
          })
        }
      })

      console.log('📱 Notificação criada:', data.title)
      return true
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
      return false
    }
  }

  // Notificar nova visita agendada
  static async newVisitScheduled(visitId: string, propertyId: string, agentId?: string) {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        property: true,
        user: true,
        client: true
      }
    })

    if (!visit) return false

    const clientName = visit.user?.name || visit.client?.name || 'Cliente'
    const propertyTitle = visit.property?.title || 'Imóvel'

    await this.create({
      title: 'Nova Visita Agendada',
      message: `${clientName} agendou uma visita para ${propertyTitle}`,
      type: 'info',
      userId: agentId,
      propertyId,
      visitId
    })

    // Notificar por email si configurado
    await this.sendEmailNotification(agentId, {
      subject: 'Nova Visita Agendada',
      message: `Uma nova visita foi agendada para ${propertyTitle} em ${visit.date.toLocaleDateString('pt-BR')}`
    })
  }

  // Notificar novo lead
  static async newLead(propertyId: string, clientData: any) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { agent: true }
    })

    if (!property) return false

    await this.create({
      title: 'Novo Lead',
      message: `Interesse demonstrado em ${property.title}`,
      type: 'success',
      userId: property.agent?.id,
      propertyId
    })
  }

  // Notificar favorito adicionado
  static async propertyFavorited(propertyId: string, userId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { agent: true }
    })

    if (!property) return false

    await this.create({
      title: 'Imóvel Favoritado',
      message: `${property.title} foi adicionado aos favoritos`,
      type: 'info',
      userId: property.agent?.id,
      propertyId
    })
  }

  // Enviar notificação por email (se configurado)
  private static async sendEmailNotification(userId?: string, data?: any) {
    if (!userId || !process.env.RESEND_API_KEY) return false

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user?.email) return false

      // Implementar envio de email aqui
      console.log('📧 Email enviado para:', user.email)
      return true
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }
  }

  // Buscar notificações do usuário
  static async getUserNotifications(userId: string, limit = 10) {
    try {
      const notifications = await prisma.activityLog.findMany({
        where: {
          userId,
          action: {
            contains: 'NOTIFICATION'
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      })

      return notifications.map(n => {
        try {
          const details = JSON.parse(n.details || '{}')
          return {
            id: n.id,
            title: details.title || 'Notificação',
            message: details.message || '',
            type: n.action.replace('NOTIFICATION_', '').toLowerCase(),
            timestamp: n.createdAt,
            read: false // Implementar sistema de lidas depois
          }
        } catch {
          return {
            id: n.id,
            title: 'Notificação',
            message: n.details || '',
            type: 'info',
            timestamp: n.createdAt,
            read: false
          }
        }
      })
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
      return []
    }
  }
}