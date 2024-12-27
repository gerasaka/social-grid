import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailsPage } from './post-details.component';

describe('PostDetailsComponent', () => {
  let component: PostDetailsPage;
  let fixture: ComponentFixture<PostDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
