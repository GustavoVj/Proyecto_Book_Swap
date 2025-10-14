import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BooksService, Book } from '../../Services/books.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { HeaderComponent } from 'src/app/header/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  books$!: Observable<Book[]>;
  currentUserId: string | null = null;

  constructor(
    private booksService: BooksService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.books$ = this.booksService.getBooks();

    this.auth.onAuthStateChanged(user => {
      this.currentUserId = user?.uid || null;
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToAgregar() {
    this.router.navigate(['/form-libro']);
  }

  verDetalle(libro: Book) {
    if (!this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/detalle-libro', libro.id]);
  }

  editBook(libro: Book) {
    this.router.navigate(['/form-libro', libro.id]);
  }

  deleteBook(libro: Book) {
    if (confirm('¿Deseas eliminar este libro?')) {
      this.booksService.deleteBook(libro.id!).then(() => {
        alert('Libro eliminado correctamente');
      });
    }
  }

  esDueno(libro: Book): boolean {
    return libro.ownerId === this.currentUserId;
  }
}
