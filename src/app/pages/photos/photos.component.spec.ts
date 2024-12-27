import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosPage } from './photos.component';

describe('PhotosComponent', () => {
  let component: PhotosPage;
  let fixture: ComponentFixture<PhotosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
