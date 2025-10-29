import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

interface Review {
  id?: string;
  reviewerId: string;
  reviewedId: string;
  exchangeId: string;
  rating: number;
  comment: string;
  createdAt: number;
}

@Component({
  standalone: true,
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  imports: [IonicModule, CommonModule, HeaderComponent],
})
export class ReviewsPage implements OnInit {
  userId!: string;
  reviews$: Observable<Review[]> | null = null;
  averageRating = 0;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadReviews();
  }

  /* Cargar reseñas recibidas */
  loadReviews() {
    const ref = collection(this.firestore, 'reviews_v2');
    const q = query(ref, where('reviewedId', '==', this.userId));
    const data$ = collectionData(q, { idField: 'id' }) as Observable<Review[]>;

    this.reviews$ = data$.pipe(
      map((reviews) => {
        this.averageRating = reviews.length
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          : 0;
        return reviews.sort((a, b) => b.createdAt - a.createdAt);
      })
    );
  }
}
