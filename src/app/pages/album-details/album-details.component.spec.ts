import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumDetailsPage } from './album-details.component';

describe('AlbumDetailsComponent', () => {
  let component: AlbumDetailsPage;
  let fixture: ComponentFixture<AlbumDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumDetailsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
