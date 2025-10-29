import { Component } from '@angular/core';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  email = '';
  password = '';
  displayName = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  /* Registrar nuevo usuario */
  async registrar() {
    if (!this.email || !this.password || !this.displayName) {
      this.presentToast('Por favor, completa todos los campos.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const cred = await this.authService.register(this.email, this.password, this.displayName);

      await loading.dismiss();

      if (cred?.user) {
        await this.presentToast('✅ Cuenta creada exitosamente', 'success');
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        throw new Error('No se pudo registrar el usuario.');
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      await loading.dismiss();
      this.presentToast('⚠️ ' + (error.message || 'Error al registrarse'), 'danger');
    }
  }

  /** 🔹 Login con Google */
  async loginWithGoogle() {
    try {
      const loading = await this.loadingCtrl.create({
        message: 'Iniciando con Google...',
        spinner: 'crescent',
      });
      await loading.present();

      await this.authService.loginWithGoogle();
      await loading.dismiss();
      await this.presentToast('Inicio de sesión exitoso con Google ✅', 'success');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error: any) {
      console.error('Error con Google:', error);
      await this.presentToast('❌ ' + (error.message || 'Error con Google'), 'danger');
    }
  }

  /* Helper para mostrar Toasts */
  private async presentToast(message: string, color: 'success' | 'warning' | 'danger' | 'medium') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
