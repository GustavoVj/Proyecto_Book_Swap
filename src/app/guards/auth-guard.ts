import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = getAuth();
  

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario autenticado → permitir acceso
        resolve(true);
      } else {
        // No autenticado → redirigir al login
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
