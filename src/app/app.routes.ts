import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'mis-libros',
    loadComponent: () => import('./pages/mis-libros/mis-libros.page').then(m => m.MisLibrosPage),
  },
  {
    path: 'detalle-libro',
    loadComponent: () => import('./pages/detalle-libro/detalle-libro.page').then(m => m.DetalleLibroPage),
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./pages/notificaciones/notificaciones.page').then(m => m.NotificacionesPage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
  },
  // 🔒 opcional: ruta wildcard para páginas no encontradas
  {
    path: '**',
    redirectTo: 'login',
  },
];
