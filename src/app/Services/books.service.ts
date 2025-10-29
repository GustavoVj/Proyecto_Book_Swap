import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  docData,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Book } from '../Models/book.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private booksRef = collection(this.firestore, 'books_v2');
  private exchangesRef = collection(this.firestore, 'exchanges_v2');

  constructor(private firestore: Firestore, private auth: AuthService) {}

  /* Obtener todos los libros (stream en tiempo real) */
  getBooks(): Observable<Book[]> {
    return collectionData(this.booksRef, { idField: 'id' }) as Observable<Book[]>;
  }

  /* Obtener un libro por ID */
  getBookById(id: string): Observable<Book> {
    return docData(doc(this.firestore, `books_v2/${id}`), { idField: 'id' }) as Observable<Book>;
  }

  /* Crear libro con ownerId */
  async createBook(book: Omit<Book, 'id' | 'ownerId' | 'createdAt'>) {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Usuario no autenticado');

    const newBook = {
      ...book,
      ownerId: userId,
      createdAt: Date.now(),
      disponible: true,
    };

    return await addDoc(this.booksRef, newBook);
  }

  /* Actualizar libro */
  async updateBook(id: string, book: Partial<Book>) {
    const docRef = doc(this.firestore, `books_v2/${id}`);
    await updateDoc(docRef, book);
  }

  /* Eliminar libro */
  async deleteBook(id: string) {
    const docRef = doc(this.firestore, `books_v2/${id}`);
    await deleteDoc(docRef);
  }

  /* Obtener libros del usuario actual */
  getBooksByUser(userId: string): Observable<Book[]> {
    const ref = collection(this.firestore, 'books_v2');
    const q = query(ref, where('ownerId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Book[]>;
  }

  /* Crear solicitud de intercambio (usa exchanges_v2) */
  async addRequest(request: {
    bookRequestedId: string;
    bookOfferedId: string;
    requestedBy: string;
    ownerId: string;
    createdAt: number;
    status: string;
  }) {
    return await addDoc(this.exchangesRef, request);
  }
}
