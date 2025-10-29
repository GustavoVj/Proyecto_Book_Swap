import { Injectable } from '@angular/core';
import {
  Auth,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = user(this.auth);
  }

  /* Devuelve el UID del usuario actual */
  getUserId(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  /* Devuelve el usuario actual */
  get currentUser() {
    return this.auth.currentUser;
  }

  /* Registro con email y contraseña */
  async register(email: string, password: string, displayName?: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const userData = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: displayName || email.split('@')[0],
      photoURL: cred.user.photoURL || 'assets/default-user.jpg',
    };
    await setDoc(doc(this.firestore, 'users', cred.user.uid), userData, { merge: true });
    return cred;
  }

  /* Login con email y contraseña */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /* Login con Google */
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const user = result.user;

    await setDoc(
      doc(this.firestore, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || 'assets/default-user.jpg',
      },
      { merge: true }
    );

    return result;
  }

  /* Cerrar sesión (principal) */
  async signOut() {
    await signOut(this.auth);
  }

  /* Compatibilidad: alias para signOut() */
  logout() {
    return this.signOut();
  }
}
