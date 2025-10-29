import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LocalNotifications, LocalNotificationActionPerformed } from '@capacitor/local-notifications';

@Injectable({ providedIn: 'root' })
export class Pushlocal {
  private initialized = false;
  private readonly CHANNEL_ID = 'urgent';

  constructor(private platform: Platform) {}

  private notifId(): number {
    return Math.floor(Date.now() / 1000);
  }

  async init() {
    if (this.initialized) return;
    await this.platform.ready();

    const { display } = await LocalNotifications.checkPermissions();
    if (display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }

    await LocalNotifications.createChannel({
      id: this.CHANNEL_ID,
      name: 'Urgent',
      description: 'Canal de notificaciones locales',
      importance: 5,
      sound: 'default',
      vibration: true,
      lights: true
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (ev: LocalNotificationActionPerformed) => {
      console.log('[Local] tap:', ev.notification);
    });

    this.initialized = true;
  }

  async notifyNow(title: string, body: string, extra?: Record<string, any>) {
    await this.init();
    await LocalNotifications.schedule({
      notifications: [{
        id: this.notifId(),
        title,
        body,
        channelId: this.CHANNEL_ID,
        extra
      }]
    });
  }
}
