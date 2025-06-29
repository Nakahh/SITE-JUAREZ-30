
interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

class NotificationService {
  private static instance: NotificationService
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Este navegador não suporta notificações')
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    const permission = await this.requestPermission()
    
    if (permission === 'granted') {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/logo-siqueira.svg',
        badge: payload.badge || '/logo-siqueira.svg',
        data: payload.data,
        actions: payload.actions
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }
  }

  async sendVisitScheduledNotification(propertyTitle: string, date: string) {
    await this.sendNotification({
      title: '✅ Visita Agendada!',
      body: `Sua visita para ${propertyTitle} foi agendada para ${date}`,
      data: { type: 'visit_scheduled' }
    })
  }

  async sendNewPropertyNotification(propertyTitle: string) {
    await this.sendNotification({
      title: '🏠 Novo Imóvel Disponível!',
      body: `Confira: ${propertyTitle}`,
      data: { type: 'new_property' }
    })
  }

  async sendChatMessageNotification(message: string) {
    await this.sendNotification({
      title: '💬 Nova Mensagem',
      body: message,
      data: { type: 'chat_message' }
    })
  }
}

export const notificationService = NotificationService.getInstance()
