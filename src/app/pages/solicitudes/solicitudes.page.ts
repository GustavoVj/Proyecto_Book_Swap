import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { HeaderComponent } from '../header/header.component';
import { BooksService } from '../../Services/books.service';
import { AuthService } from '../../Services/auth.service';
import { ReviewsService } from '../../Services/reviews';
import { Pushlocal } from '../../Services/push';

interface ExchangeVM {
  id?: string;
  bookRequestedId: string;
  bookOfferedId: string;
  requestedBy: string;
  ownerId: string;
  createdAt: number;
  status: string;
  requestedBookTitle?: string;
  offeredBookTitle?: string;
}

@Component({
  standalone: true,
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule, HeaderComponent],
})
export class SolicitudesPage implements OnInit {
  userId: string | null = null;
  solicitudesRecibidas$: Observable<ExchangeVM[]> | null = null;
  solicitudesEnviadas$: Observable<ExchangeVM[]> | null = null;

  constructor(
    private firestore: Firestore,
    private booksService: BooksService,
    private auth: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private reviewsSvc: ReviewsService,
    private push: Pushlocal
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.userId = user?.uid ?? null;
      if (this.userId) this.cargarSolicitudes();
    });
  }

  /** 🔹 Cargar solicitudes (recibidas y enviadas) */
  cargarSolicitudes() {
    const ref = collection(this.firestore, 'exchanges_v2');
    const all$ = collectionData(ref, { idField: 'id' }) as Observable<ExchangeVM[]>;

    this.solicitudesRecibidas$ = all$.pipe(
      map((data) => data.filter((x) => x.ownerId === this.userId))
    );

    this.solicitudesEnviadas$ = all$.pipe(
      map((data) => data.filter((x) => x.requestedBy === this.userId))
    );
  }

  /* Aceptar solicitud */
  async aceptar(req: ExchangeVM) {
    try {
      if (!req.id) throw new Error('Solicitud sin ID válido.');

      const ref = doc(this.firestore, `exchanges_v2/${req.id}`);
      await updateDoc(ref, { status: 'aceptado' });

      await this.push.notifyNow(
        '📚 Intercambio aceptado',
        'Has aceptado una solicitud de intercambio.'
      );

      await this.toast('✅ Solicitud aceptada', 'success');

      // 💬 Pedir reseña después de aceptar
      await this.solicitarReseña(req);
    } catch (error) {
      console.error('[Aceptar Solicitud]', error);
      await this.toast('Error al aceptar la solicitud', 'medium');
    }
  }

  /* Rechazar solicitud */
  async rechazar(req: ExchangeVM) {
    try {
      const alert = await this.alertCtrl.create({
        header: 'Rechazar solicitud',
        message: '¿Seguro que deseas rechazar esta solicitud?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Rechazar',
            handler: async () => {
              if (!req.id) return;
              const ref = doc(this.firestore, `exchanges_v2/${req.id}`);
              await updateDoc(ref, { status: 'rechazado' });

              await this.push.notifyNow(
                '❌ Solicitud rechazada',
                'Has rechazado una solicitud de intercambio.'
              );
              await this.toast('❌ Solicitud rechazada', 'medium');
            },
          },
        ],
      });

      await alert.present();
    } catch (error) {
      console.error('[Rechazar Solicitud]', error);
      await this.toast('Error al rechazar', 'medium');
    }
  }

  /* Mostrar alerta para reseñar */
  private async solicitarReseña(req: ExchangeVM) {
    const alert = await this.alertCtrl.create({
      header: '⭐ Valora tu intercambio',
      message: 'Deja una reseña para el usuario con quien realizaste el intercambio',
      inputs: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          placeholder: 'Puntuación (1 a 5)',
        },
        {
          name: 'comment',
          type: 'textarea',
          placeholder: 'Escribe tu opinión (opcional)...',
        },
      ],
      buttons: [
        { text: 'Omitir', role: 'cancel' },
        {
          text: 'Enviar',
          handler: async (data) => {
            try {
              const rating = Number(data.rating);
              const comment = data.comment?.trim() || '';

              if (!rating || rating < 1 || rating > 5) {
                await this.toast('Ingresa una puntuación válida (1–5)', 'medium');
                return false; // ← evita cerrar el alert
              }

              await this.reviewsSvc.addReview({
                reviewerId: this.auth.getUserId()!,
                reviewedId: req.requestedBy,
                exchangeId: req.id!,
                rating,
                comment,
                createdAt: Date.now(),
              });

              await this.push.notifyNow(
                '⭐ Nueva reseña enviada',
                'Has calificado tu intercambio exitosamente.'
              );

              await this.toast('Reseña enviada ⭐', 'success');
              return true; // ← cierra el alert
            } catch (error) {
              console.error('[Enviar Reseña]', error);
              await this.toast('Error al enviar reseña', 'medium');
              return true; // ← siempre devuelve algo
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /* Toast Helper */
  private async toast(message: string, color: 'success' | 'medium') {
    const t = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await t.present();
  }
}
