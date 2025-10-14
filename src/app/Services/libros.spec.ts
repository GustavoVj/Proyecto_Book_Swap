import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private libros = [
    { id: '1', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', categoria: 'Novela', descripcion: 'Obra maestra del realismo mágico.' },
    { id: '2', titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', categoria: 'Clásico', descripcion: 'Aventuras del ingenioso hidalgo.' },
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
