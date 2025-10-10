import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BooksService, Book } from '../../Services/books.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  books$!: Observable<Book[]>;

  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.books$ = this.booksService.getBooks();
  }
}
