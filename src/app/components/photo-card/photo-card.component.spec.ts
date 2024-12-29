import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MOCK_PHOTO } from '../../core/sample-response/photos';
import { PhotoCardComponent } from './photo-card.component';

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let componentRef: ComponentRef<PhotoCardComponent>;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('photo', MOCK_PHOTO);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
