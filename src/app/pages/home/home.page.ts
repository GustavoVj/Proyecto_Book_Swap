import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BooksService } from '../../Services/books.service';
import { AuthService } from '../../Services/auth.service';
import { Book } from '../../Models/book.model';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

// Importación de Ionicons (necesario en Ionic 8+)
import { addIcons } from 'ionicons';
import {
  addOutline,
  createOutline,
  trashOutline,
  bookOutline,
} from 'ionicons/icons';

addIcons({
  'add-outline': addOutline,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'book-outline': bookOutline,
});

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule, HeaderComponent],
})
export class HomePage implements OnInit {
  books$!: Observable<Book[]>;
  userId: string | null = null;

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    // Escuchar sesión activa
    this.authService.user$.subscribe((user) => (this.userId = user?.uid ?? null));
    this.books$ = this.booksService.getBooks();
  }

  onImageError(event: any) {
    event.target.src = 'assets/default-book.jpg';
  }

  esDueno(book: Book): boolean {
    return book.ownerId === this.userId;
  }

  goToAgregar() {
    this.router.navigate(['/form-libro']);
  }

  verDetalle(book: Book) {
    this.router.navigate(['/detalle-libro', book.id]);
  }

  editBook(book: Book) {
    this.router.navigate(['/form-libro'], { queryParams: { id: book.id } });
  }

  async deleteBook(id: string) {
    try {
      await this.booksService.deleteBook(id);
      const toast = await this.toastCtrl.create({
        message: 'Libro eliminado',
        duration: 1800,
        color: 'success',
      });
      await toast.present();
    } catch (err) {
      console.error(err);
      const toast = await this.toastCtrl.create({
        message: 'No se pudo eliminar',
        duration: 1800,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
