import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLibroPage } from './form-libro.page';

describe('FormLibroPage', () => {
  let component: FormLibroPage;
  let fixture: ComponentFixture<FormLibroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
