import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BooksService } from '../../Services/books.service';
import { AuthService } from '../../Services/auth.service';
import { Book } from '../../Models/book.model';
import { HeaderComponent } from '../header/header.component';
import { Pushlocal } from '../../Services/push';

@Component({
  standalone: true,
  selector: 'app-form-libro',
  templateUrl: './form-libro.page.html',
  styleUrls: ['./form-libro.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, HeaderComponent],
})
export class FormLibroPage implements OnInit {
  book: Partial<Book> = {}; // 🟢 Compatibilidad con tu HTML
  isEditing = false;
  userId: string | null = null;
  private currentId: string | null = null;
  cargando = false;

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private push: Pushlocal
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => (this.userId = user?.uid ?? null));

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.isEditing = true;
      this.currentId = id;
      this.booksService.getBookById(id).subscribe((bk) => {
        this.book = bk;
      });
    }
  }

  /* Getter y Setter de portada */
  get coverUrlValue() {
    return this.book?.coverUrl || '';
  }

  set coverUrlValue(val: string) {
    this.book.coverUrl = val;
  }

  /* Crear libro nuevo */
  async crear() {
    if (!this.book.title || !this.book.author) {
      await this.toast('Título y autor son obligatorios', 'warning');
      return;
    }

    try {
      this.cargando = true;
      await this.booksService.createBook(this.book as Book);
      await this.push.notifyNow('📘 Libro agregado', `${this.book.title} se ha añadido a tu biblioteca.`);
      await this.toast('Libro agregado correctamente', 'success');
      this.router.navigate(['/home']);
    } catch (err) {
      console.error(err);
      await this.toast('Error al guardar el libro', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  /* Actualizar libro existente */
  async editar() {
    if (!this.currentId) return;

    try {
      this.cargando = true;
      await this.booksService.updateBook(this.currentId, this.book);
      await this.push.notifyNow('✏️ Libro actualizado', `${this.book.title} ha sido actualizado.`);
      await this.toast('Libro actualizado correctamente', 'success');
      this.router.navigate(['/home']);
    } catch (err) {
      console.error(err);
      await this.toast('Error al actualizar el libro', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  /* Eliminar libro */
  async borrar() {
    if (!this.currentId || !this.book.title) return;

    const ok = await this.confirmar(`¿Borrar "${this.book.title}"?`);
    if (!ok) return;

    try {
      this.cargando = true;
      await this.booksService.deleteBook(this.currentId);
      await this.push.notifyNow('🗑️ Libro eliminado', `${this.book.title} ha sido borrado.`);
      await this.toast('Libro eliminado', 'medium');
      this.router.navigate(['/home']);
    } catch (err) {
      console.error(err);
      await this.toast('Error al eliminar el libro', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  /** 🔙 Cancelar */
  cancelar() {
    this.router.navigate(['/home']);
  }

  /* Imagen por defecto */
  onImageError(event: any) {
    event.target.src = 'assets/default-book.jpg';
  }

  /* Toast */
  private async toast(message: string, color: 'success' | 'warning' | 'danger' | 'medium' = 'success') {
    const t = await this.toastCtrl.create({ message, duration: 2000, color });
    await t.present();
  }

  /* Confirmación */
  private async confirmar(message: string) {
    const a = await this.alertCtrl.create({
      header: 'Confirmar',
      message,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Sí', role: 'confirm' },
      ],
    });
    await a.present();
    const r = await a.onDidDismiss();
    return r.role === 'confirm';
  }
}
