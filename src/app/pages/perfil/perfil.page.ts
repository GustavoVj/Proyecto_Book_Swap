import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule, HeaderComponent],
})
export class PerfilPage implements OnInit {
  user: any = null;
  userId: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((u) => {
      this.user = u;
      this.userId = u?.uid ?? null;
    });
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: async () => {
            await this.auth.logout();
            const toast = await this.toastCtrl.create({
              message: 'Sesión cerrada correctamente',
              duration: 2000,
              color: 'success',
            });
            await toast.present();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }

  async cambiarFoto() {
    const toast = await this.toastCtrl.create({
      message: 'Función para cambiar foto (en desarrollo)',
      duration: 1500,
      color: 'medium',
    });
    await toast.present();
  }
}
