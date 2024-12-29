import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPage } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorPage;
  let fixture: ComponentFixture<ErrorPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
