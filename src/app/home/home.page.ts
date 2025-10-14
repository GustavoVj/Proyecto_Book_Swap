import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../header/header/header.component';
import { Book, BooksService } from '../Services/books.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent],
})
export class HomePage {
  books$!: Observable<Book[]>;

  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.books$ = this.booksService.getBooks();
  }
}
