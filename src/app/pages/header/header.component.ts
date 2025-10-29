import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  logOutOutline,
  logInOutline,
  notificationsOutline,
} from 'ionicons/icons';

addIcons({
  'person-circle-outline': personCircleOutline,
  'log-out-outline': logOutOutline,
  'log-in-outline': logInOutline,
  'notifications-outline': notificationsOutline,
});

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
})
export class HeaderComponent {
  user$ = this.auth.user$;

  constructor(
    public auth: AuthService, // ← cambiado a público para usar en el HTML
    public router: Router,
    private alertCtrl: AlertController
  ) {}

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: async () => {
            await this.auth.signOut();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSolicitudes() {
    this.router.navigate(['/solicitudes']);
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }
}
