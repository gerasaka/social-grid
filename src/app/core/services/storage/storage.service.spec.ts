import { TestBed } from '@angular/core/testing';
import { MOCK_POST, MOCK_POST_LIST } from '../../sample-response/post';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'bookmarked-post') return JSON.stringify({ [MOCK_POST.id]: MOCK_POST });
      else return null;
    });

    spyOn(localStorage, 'setItem').and.callFake(() => {});
  });

  it('should retrieve bookmarked posts from localStorage', () => {
    service.retrieveBookmarkedPosts();
    const bookmarkedLength = Object.keys(service.bookmarkedPosts()).length;

    expect(bookmarkedLength).not.toEqual(0);
    expect(service.bookmarkedPosts()[MOCK_POST.id]).toEqual(MOCK_POST);
  });

  it('should add a bookmark and update localStorage', () => {
    const MOCK_POST_2 = MOCK_POST_LIST[1];

    service.retrieveBookmarkedPosts();
    service.addBookmark(MOCK_POST_2);
    const bookmarkedLength = Object.keys(service.bookmarkedPosts()).length;

    expect(bookmarkedLength).toEqual(2);
    expect(service.bookmarkedPosts()[MOCK_POST_2.id]).toEqual(MOCK_POST_2);
  });

  it('should remove a bookmark and update localStorage', () => {
    service.retrieveBookmarkedPosts();
    service.removeBookmark(MOCK_POST.id);

    expect(service.bookmarkedPosts()[MOCK_POST.id]).toBeUndefined();
    expect(localStorage.setItem).toHaveBeenCalledWith('bookmarked-post', jasmine.any(String));
  });
});
