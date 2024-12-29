import { TestBed } from '@angular/core/testing';
import { MOCK_BOOKMARKED } from '../../sample-response/bookmark';
import { MOCK_POST, MOCK_POST_LIST } from '../../sample-response/post';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    spyOn(localStorage, 'setItem').and.callFake(() => {});
    spyOn(service.bookmarkedPosts, 'set').and.callThrough();
  });

  describe('retrieveBookmarkedPosts', () => {
    it('should set an empty object if localStorage is empty', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      service.retrieveBookmarkedPosts();

      expect(localStorage.getItem).toHaveBeenCalledWith('bookmarked-post');
      expect(service.bookmarkedPosts.set).toHaveBeenCalledWith({});
      expect(service.bookmarkedPosts()).toEqual({});
    });

    it('should set parsed data if localStorage contains valid JSON', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(MOCK_BOOKMARKED));

      service.retrieveBookmarkedPosts();

      expect(localStorage.getItem).toHaveBeenCalledWith('bookmarked-post');
      expect(service.bookmarkedPosts.set).toHaveBeenCalledWith(MOCK_BOOKMARKED);
    });

    it('should handle invalid JSON gracefully', () => {
      spyOn(localStorage, 'getItem').and.returnValue('{invalid-json}');
      spyOn(console, 'error');

      expect(() => service.retrieveBookmarkedPosts()).toThrow();
    });
  });

  it('should add a bookmark and update localStorage', () => {
    const MOCK_POST_2 = MOCK_POST_LIST[1];

    service.retrieveBookmarkedPosts();
    service.addBookmark(MOCK_POST_2);
    const bookmarkedLength = Object.keys(service.bookmarkedPosts()).length;

    expect(bookmarkedLength).toEqual(1);
    expect(service.bookmarkedPosts()[MOCK_POST_2.id]).toEqual(MOCK_POST_2);
  });

  it('should remove a bookmark and update localStorage', () => {
    service.retrieveBookmarkedPosts();
    service.removeBookmark(MOCK_POST.id);

    expect(service.bookmarkedPosts()[MOCK_POST.id]).toBeUndefined();
    expect(localStorage.setItem).toHaveBeenCalledWith('bookmarked-post', jasmine.any(String));
  });
});
