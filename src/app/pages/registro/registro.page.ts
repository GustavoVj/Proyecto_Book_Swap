import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss']
})
export class RegistroPage {
  email = '';
  password = '';
  displayName = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async register() {
    try {
      await this.authService.register(this.email, this.password, this.displayName);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al registrarse: ' + (error as any).message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error con Google: ' + (error as any).message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
