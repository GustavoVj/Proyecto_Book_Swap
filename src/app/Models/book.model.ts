// src/app/Models/book.model.ts
export interface Book {
  id?: string;
  title: string;
  author: string;
  description?: string;
  disponible: boolean;
  imageUrl?: string;
  ownerId: string;
  createdAt?: number;
  isLocked?: boolean;
  coverUrl?: string;
}


