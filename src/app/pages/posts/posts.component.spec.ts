import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsPages } from './posts.component';

describe('PostsComponent', () => {
  let component: PostsPages;
  let fixture: ComponentFixture<PostsPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsPages],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
