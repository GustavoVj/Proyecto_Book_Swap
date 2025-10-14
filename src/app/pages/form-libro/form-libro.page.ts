import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BooksService } from 'src/app/Services/books.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-form-libro',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './form-libro.page.html',
  styleUrls: ['./form-libro.page.scss']
})
export class FormLibroPage implements OnInit {
  bookForm!: FormGroup;
  isEdit = false;
  bookId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private booksService: BooksService,
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.bookId;

    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['']
    });

    if (this.isEdit) {
      this.booksService.getBookById(this.bookId!).subscribe(book => {
        this.bookForm.patchValue(book);
      });
    }
  }

  async onSubmit() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      const toast = await this.toastCtrl.create({
        message: 'Debes iniciar sesión para agregar o editar libros',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const bookData = { ...this.bookForm.value, ownerId: user.uid };

    if (this.isEdit) {
      await this.booksService.updateBook(this.bookId!, bookData);
    } else {
      await this.booksService.addBook(bookData);
    }

    const toast = await this.toastCtrl.create({
      message: this.isEdit ? 'Libro actualizado ✅' : 'Libro agregado 📚',
      duration: 2000,
      color: 'success'
    });
    toast.present();

    this.router.navigate(['/home']);
  }
}
