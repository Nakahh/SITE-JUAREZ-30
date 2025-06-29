
import { prisma } from '@/lib/prisma'

export interface NotificationData {
  userId: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  actionUrl?: string
  read?: boolean
}

export class NotificationService {
  // Criar notificação
  static async create(data: NotificationData) {
    try {
      // Salvar no banco como ActivityLog
      await prisma.activityLog.create({
        data: {
          userId: data.userId,
          action: `NOTIFICATION_${data.type}`,
          details: JSON.stringify({
            title: data.title,
            message: data.message,
            actionUrl: data.actionUrl,
            read: data.read || false
          })
        }
      })

      // Se tiver service worker, enviar push notification
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        this.sendPushNotification(data)
      }

      return true
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
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
            startsWith: 'NOTIFICATION_'
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      })

      return notifications.map(notif => ({
        id: notif.id,
        type: notif.action.replace('NOTIFICATION_', ''),
        ...JSON.parse(notif.details || '{}'),
        createdAt: notif.createdAt
      }))
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
      return []
    }
  }

  // Marcar como lida
  static async markAsRead(notificationId: string) {
    try {
      const notification = await prisma.activityLog.findUnique({
        where: { id: notificationId }
      })

      if (notification) {
        const details = JSON.parse(notification.details || '{}')
        details.read = true

        await prisma.activityLog.update({
          where: { id: notificationId },
          data: {
            details: JSON.stringify(details)
          }
        })
      }

      return true
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
      return false
    }
  }

  // Enviar push notification (lado cliente)
  private static async sendPushNotification(data: NotificationData) {
    try {
      const registration = await navigator.serviceWorker.ready
      
      if ('showNotification' in registration) {
        await registration.showNotification(data.title, {
          body: data.message,
          icon: '/logo-siqueira.svg',
          badge: '/logo-siqueira.svg',
          tag: 'siqueira-notification',
          actions: data.actionUrl ? [{
            action: 'open',
            title: 'Ver detalhes'
          }] : [],
          data: {
            url: data.actionUrl || '/'
          }
        })
      }
    } catch (error) {
      console.error('Erro ao enviar push notification:', error)
    }
  }

  // Notificações automáticas para eventos
  static async notifyNewProperty(propertyId: string, agentId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { agent: true }
    })

    if (property) {
      // Notificar admin
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      })

      for (const admin of admins) {
        await this.create({
          userId: admin.id,
          title: 'Novo Imóvel Cadastrado',
          message: `${property.agent?.name} cadastrou: ${property.title}`,
          type: 'INFO',
          actionUrl: `/admin/imoveis/${property.id}`
        })
      }
    }
  }

  static async notifyNewVisit(visitId: string) {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        property: {
          include: { agent: true }
        },
        user: true,
        client: true
      }
    })

    if (visit && visit.property?.agent) {
      const clientName = visit.user?.name || visit.client?.name || 'Cliente'
      
      await this.create({
        userId: visit.property.agent.id,
        title: 'Nova Visita Agendada',
        message: `${clientName} agendou visita para ${visit.property.title}`,
        type: 'INFO',
        actionUrl: `/admin/visitas/${visit.id}`
      })
    }
  }
}

// Utilitários para usar nos componentes
export const useNotifications = () => {
  const sendNotification = async (data: NotificationData) => {
    return await NotificationService.create(data)
  }

  const getUserNotifications = async (userId: string) => {
    return await NotificationService.getUserNotifications(userId)
  }

  const markAsRead = async (notificationId: string) => {
    return await NotificationService.markAsRead(notificationId)
  }

  return {
    sendNotification,
    getUserNotifications,
    markAsRead
  }
}
