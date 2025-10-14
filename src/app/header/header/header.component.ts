import { Component } from '@angular/core';
import { IonAvatar, IonButton, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class HeaderComponent {
  user$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$; // Suponiendo que tu AuthService expone esto
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }
}
