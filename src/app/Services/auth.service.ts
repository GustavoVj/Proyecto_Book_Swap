import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../Models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  // Registro con email y password
  async register(email: string, password: string, displayName?: string): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    // Guardamos datos del usuario en Firestore
    const userData: User = {
      uid: cred.user.uid,
      email: cred.user.email!,
      displayName: displayName || cred.user.displayName || ''
    };
    await setDoc(doc(this.firestore, 'users', cred.user.uid), userData);
    return cred;
  }

  // Inicio con correo
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Inicio con Google
  async loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);

    // Guardar o actualizar usuario en Firestore
    const userData: User = {
      uid: cred.user.uid,
      email: cred.user.email!,
      displayName: cred.user.displayName!,
      photoURL: cred.user.photoURL!
    };
    await setDoc(doc(this.firestore, 'users', cred.user.uid), userData);
    return cred;
  }

  async logout(): Promise<void> {
    return await signOut(this.auth);
  }

  get currentUser() {
    return this.auth.currentUser;
  }
}
