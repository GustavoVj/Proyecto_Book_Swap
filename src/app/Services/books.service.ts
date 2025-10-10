import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Book {
  id?: string;
  title: string;
  author: string;
  imageUrl?: string;
  ownerId: string;
}

@Injectable({ providedIn: 'root' })
export class BooksService {
  constructor(private firestore: Firestore) {}

  getBooks(): Observable<Book[]> {
    const booksRef = collection(this.firestore, 'books');
    return collectionData(booksRef, { idField: 'id' }) as Observable<Book[]>;
  }

  async addBook(book: Book) {
    const booksRef = collection(this.firestore, 'books');
    await addDoc(booksRef, book);
  }
}
