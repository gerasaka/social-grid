import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MOCK_BOOKMARKED } from '../../core/sample-response/bookmark';
import { MOCK_POST } from '../../core/sample-response/post';
import { MOCK_USER_LIST } from '../../core/sample-response/user';
import { StorageService } from '../../core/services/storage/storage.service';
import { PostCardComponent } from './post-card.component';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let componentRef: ComponentRef<PostCardComponent>;
  let fixture: ComponentFixture<PostCardComponent>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', [
      'users',
      'bookmarkedPosts',
      'addBookmark',
      'removeBookmark',
    ]);

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StorageService, useValue: storageService }],
    });

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('post', MOCK_POST);

    storageService.users.and.returnValue(MOCK_USER_LIST);
    storageService.bookmarkedPosts.and.returnValue(MOCK_BOOKMARKED);
  });

  it('should retrieve post information', () => {
    expect(component.getPostInfo(MOCK_POST)).toEqual({
      author: MOCK_USER_LIST[MOCK_POST.userId - 1].name,
      bookmarked: true,
    });
    expect(storageService.users).toHaveBeenCalled();
    expect(storageService.bookmarkedPosts).toHaveBeenCalled();
  });

  it('should bookmark a post', () => {
    component.bookmarkPost(MOCK_POST);

    expect(storageService.addBookmark).toHaveBeenCalledWith(MOCK_POST);
  });

  it('should remove a bookmarked post', () => {
    component.removeBookmark(MOCK_POST.id);

    expect(storageService.removeBookmark).toHaveBeenCalledWith(MOCK_POST.id);
  });
});
