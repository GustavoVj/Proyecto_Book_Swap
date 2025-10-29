import { Routes } from '@angular/router';

// Archivo de rutas principal
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // Página principal
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  // Registro (Crear cuenta)
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.page').then((m) => m.RegistroPage),
  },


  // Perfil del usuario
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },

  // Formulario para añadir o editar libros
  {
    path: 'form-libro',
    loadComponent: () =>
      import('./pages/form-libro/form-libro.page').then(
        (m) => m.FormLibroPage
      ),
  },

  // Detalle de libro
  {
    path: 'detalle-libro/:id',
    loadComponent: () =>
      import('./pages/detalle-libro/detalle-libro.page').then(
        (m) => m.DetalleLibroPage
      ),
  },

  // Solicitudes de intercambio
  {
    path: 'solicitudes',
    loadComponent: () =>
      import('./pages/solicitudes/solicitudes.page').then(
        (m) => m.SolicitudesPage
      ),
  },

  // Reseñas
  {
    path: 'reviews',
    loadComponent: () =>
      import('./pages/reviews/reviews.page').then((m) => m.ReviewsPage),
  },
  {
    path: 'reviews/:id',
    loadComponent: () =>
      import('./pages/reviews/reviews.page').then((m) => m.ReviewsPage),
  },

  // Ruta si la página no existe
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
