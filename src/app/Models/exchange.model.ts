// src/app/Models/exchange.model.ts
export interface Exchange {
  id?: string;
  bookRequestedId: string;
  bookOfferedId?: string;
  ownerId: string;
  requesterId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: number;
  completedAt?: number;
}