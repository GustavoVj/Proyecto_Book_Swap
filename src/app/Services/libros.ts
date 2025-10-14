import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private libros = [
    { id: '1', titulo: 'Cien años de soledad', autor: 'García Márquez', categoria: 'Novela', descripcion: 'Realismo mágico.' },
    { id: '2', titulo: 'Don Quijote', autor: 'Cervantes', categoria: 'Clásico', descripcion: 'Aventuras de un hidalgo.' },
  ];

  obtenerLibros() {
    return this.libros;
  }

  obtenerLibroPorId(id: string) {
    return this.libros.find(l => l.id === id);
  }

  eliminarLibro(id: string) {
    this.libros = this.libros.filter(l => l.id !== id);
  }
}
