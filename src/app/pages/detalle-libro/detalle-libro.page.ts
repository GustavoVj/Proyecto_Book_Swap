import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BooksService } from '../../Services/books.service';
import { AuthService } from '../../Services/auth.service';
import { Book } from '../../Models/book.model';
import { Observable, of, firstValueFrom } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { Pushlocal } from '../../Services/push';

// Íconos para Ionic 8+
import { addIcons } from 'ionicons';
import {
  swapHorizontalOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';

addIcons({
  'swap-horizontal-outline': swapHorizontalOutline,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
});

@Component({
  standalone: true,
  selector: 'app-detalle-libro',
  templateUrl: './detalle-libro.page.html',
  styleUrls: ['./detalle-libro.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule, HeaderComponent],
})
export class DetalleLibroPage implements OnInit {
  bookId: string | null = null;
  book$: Observable<Book | null> = of(null);
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private push: Pushlocal // Servicio de notificaciones locales
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => (this.userId = user?.uid ?? null));
    this.bookId = this.route.snapshot.paramMap.get('id');

    if (this.bookId) {
      this.book$ = this.booksService.getBookById(this.bookId);
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/default-book.jpg';
  }

  esDueno(book: Book): boolean {
    return book.ownerId === this.userId;
  }

  async eliminar(book: Book) {
    try {
      await this.booksService.deleteBook(book.id!);
      await this.push.notifyNow('🗑️ Libro eliminado', `${book.title} fue eliminado de tu biblioteca.`);
      const toast = await this.toastCtrl.create({
        message: 'Libro eliminado correctamente',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      this.router.navigate(['/home']);
    } catch (err) {
      console.error(err);
      const toast = await this.toastCtrl.create({
        message: 'Error al eliminar el libro',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  editar(book: Book) {
    this.router.navigate(['/form-libro'], { queryParams: { id: book.id } });
  }

  /* Solicitar intercambio con notificación */
  async solicitarIntercambio(book: Book) {
    try {
      if (!this.userId) {
        const toast = await this.toastCtrl.create({
          message: 'Debes iniciar sesión para solicitar un intercambio.',
          duration: 2000,
          color: 'warning',
        });
        await toast.present();
        return;
      }

      if (book.ownerId === this.userId) {
        const toast = await this.toastCtrl.create({
          message: 'No puedes solicitar intercambio con tu propio libro.',
          duration: 2000,
          color: 'medium',
        });
        await toast.present();
        return;
      }

      const librosUsuario = await firstValueFrom(this.booksService.getBooksByUser(this.userId));

      if (!librosUsuario || librosUsuario.length === 0) {
        const toast = await this.toastCtrl.create({
          message: 'No tienes libros disponibles para ofrecer.',
          duration: 2000,
          color: 'warning',
        });
        await toast.present();
        return;
      }

      const alert = document.createElement('ion-alert');
      alert.header = 'Selecciona un libro para ofrecer';
      alert.inputs = librosUsuario.map((libro) => ({
        label: libro.title,
        type: 'radio',
        value: libro.id,
      }));
      alert.buttons = [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Ofrecer',
          handler: async (bookOfferedId) => {
            if (!bookOfferedId) return;

            const solicitud = {
              bookRequestedId: book.id!,
              bookOfferedId,
              requestedBy: this.userId!,
              ownerId: book.ownerId!,
              createdAt: Date.now(),
              status: 'pendiente',
            };

            await this.booksService.addRequest(solicitud);
            await this.push.notifyNow('📨 Solicitud enviada', `Has solicitado un intercambio por "${book.title}".`);

            const toast = await this.toastCtrl.create({
              message: 'Solicitud enviada con éxito 📚',
              duration: 2000,
              color: 'success',
            });
            await toast.present();
          },
        },
      ];

      document.body.appendChild(alert);
      await alert.present();
    } catch (error) {
      console.error(error);
      const toast = await this.toastCtrl.create({
        message: 'Error al enviar la solicitud',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
