import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Review {
  id?: string;
  reviewerId: string;
  reviewedId: string;
  exchangeId?: string;
  rating: number;
  comment: string;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private ref = collection(this.firestore, 'reviews_v2');

  constructor(private firestore: Firestore) {}

  /* Crear reseña */
  async addReview(review: Review) {
    return await addDoc(this.ref, review);
  }

  /* Obtener reseñas de un usuario */
  getReviewsByUser(userId: string): Observable<Review[]> {
    const q = query(this.ref, where('reviewedId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Review[]>;
  }

  /* Calcular promedio */
  async getAverageRating(userId: string): Promise<number> {
    const reviews = await new Promise<Review[]>((resolve) => {
      this.getReviewsByUser(userId).subscribe((r) => resolve(r));
    });
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return total / reviews.length;
  }
}
