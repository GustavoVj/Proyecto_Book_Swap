import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Book {
  id?: string;
  title: string;
  author: string;
  description?: string;
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

  getBookById(id: string): Observable<Book> {
    const bookDoc = doc(this.firestore, `books/${id}`);
    return docData(bookDoc, { idField: 'id' }) as Observable<Book>;
  }

  async addBook(book: Book) {
    const booksRef = collection(this.firestore, 'books');
    await addDoc(booksRef, book);
  }

  async updateBook(id: string, data: Partial<Book>) {
    const bookDoc = doc(this.firestore, `books/${id}`);
    await updateDoc(bookDoc, data);
  }

  async deleteBook(id: string) {
    const bookDoc = doc(this.firestore, `books/${id}`);
    await deleteDoc(bookDoc);
  }
}
