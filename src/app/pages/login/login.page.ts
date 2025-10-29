import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { HeaderComponent } from 'src/app/pages/header/header.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HeaderComponent],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al iniciar sesión: ' + (error as any).message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }

  goToRegistro() {
  this.router.navigate(['/registro']);
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log('Usuario autenticado:', user);

      const toast = await this.toastCtrl.create({
        message: `Bienvenido ${user.displayName}!`,
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/home']);

    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);

      const toast = await this.toastCtrl.create({
        message: 'Error al iniciar sesión con Google',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
