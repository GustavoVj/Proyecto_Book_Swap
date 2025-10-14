import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService, Book } from 'src/app/Services/books.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-detalle-libro',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './detalle-libro.page.html',
  styleUrls: ['./detalle-libro.page.scss']
})
export class DetalleLibroPage implements OnInit {
  libro$!: Observable<Book>;
  libro!: Book;
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private auth: Auth
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.libro$ = this.booksService.getBookById(id);
    this.libro$.subscribe(book => (this.libro = book));

    this.auth.onAuthStateChanged(user => {
      this.currentUserId = user?.uid || null;
    });
  }

  esDueno(): boolean {
    return this.libro.ownerId === this.currentUserId;
  }

  editBook() {
    this.router.navigate(['/form-libro', this.libro.id]);
  }

  deleteBook() {
    if (confirm('¿Deseas eliminar este libro?')) {
      this.booksService.deleteBook(this.libro.id!).then(() => {
        alert('Libro eliminado correctamente');
        this.router.navigate(['/home']);
      });
    }
  }
}
