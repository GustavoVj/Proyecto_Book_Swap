import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from '@angular/fire/firestore';
import { Exchange } from '../Models/exchange.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  private exchangesRef = collection(this.firestore, 'exchanges_v2');

  constructor(private firestore: Firestore, private auth: AuthService) {}

  /* Crear solicitud de intercambio */
  async createExchange(exchange: Exchange) {
    return await addDoc(this.exchangesRef, exchange);
  }

  /* Obtener intercambios del propietario */
  getExchangesByOwner(userId: string) {
    const q = query(this.exchangesRef, where('ownerId', '==', userId));
    return getDocs(q).then((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Exchange[]);
  }

  /* Obtener intercambios del usuario (como solicitante o dueño) */
  async getUserExchanges() {
    const userId = this.auth.getUserId();
    if (!userId) return [];

    const q1 = query(this.exchangesRef, where('ownerId', '==', userId));
    const q2 = query(this.exchangesRef, where('requesterId', '==', userId));

    const [ownerSnap, requesterSnap] = await Promise.all([getDocs(q1), getDocs(q2)]);
    return [
      ...ownerSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      ...requesterSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    ] as Exchange[];
  }

  /* Aceptar intercambio */
  async acceptExchange(exchangeId: string) {
    const docRef = doc(this.firestore, `exchanges_v2/${exchangeId}`);
    await updateDoc(docRef, { status: 'accepted' });
  }

  /* Rechazar intercambio */
  async rejectExchange(exchangeId: string) {
    const docRef = doc(this.firestore, `exchanges_v2/${exchangeId}`);
    await deleteDoc(docRef);
  }

  /* Marcar intercambio como completado */
  async completeExchange(exchangeId: string) {
    const docRef = doc(this.firestore, `exchanges_v2/${exchangeId}`);
    await updateDoc(docRef, { status: 'completed' });
  }
}
