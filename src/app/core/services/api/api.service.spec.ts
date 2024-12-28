import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_ALBUM, MOCK_ALBUM_LIST } from '../../sample-response/album';
import { MOCK_PHOTO, MOCK_PHOTO_LIST } from '../../sample-response/photos';
import { MOCK_POST, MOCK_POST_LIST } from '../../sample-response/post';
import { MOCK_USER, MOCK_USER_LIST } from '../../sample-response/user';
import { StorageService } from '../storage/storage.service';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['posts', 'albums', 'photos'], {
      users: { set: jasmine.createSpy('set') },
    });

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: StorageService, useValue: storageSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  afterEach(() => {
    http.verify();
  });

  it('should fetch all posts and update storage', () => {
    service.getAllPosts$().subscribe((posts) => {
      expect(posts).toEqual(MOCK_POST_LIST);
      expect(storageService.posts).toEqual(MOCK_POST_LIST);
    });

    const req = http.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.flush(MOCK_POST_LIST);
  });

  it('should fetch post details by ID', () => {
    const postId = 1;

    service.getPostDetails$(postId).subscribe((post) => {
      expect(post).toEqual(MOCK_POST);
    });

    const req = http.expectOne(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    req.flush(MOCK_POST);
  });

  it('should load users and update storage', () => {
    service.loadUsers();

    const req = http.expectOne('https://jsonplaceholder.typicode.com/users');
    req.flush(MOCK_USER_LIST);

    expect(storageService.users.set).toHaveBeenCalledWith(MOCK_USER_LIST);
  });

  it('should fetch user details by ID', () => {
    const userId = 1;

    service.getUserDetails$(userId).subscribe((user) => {
      expect(user).toEqual(MOCK_USER);
    });

    const req = http.expectOne(`https://jsonplaceholder.typicode.com/users/${userId}`);
    req.flush(MOCK_USER);
  });

  it('should fetch all albums and update storage', () => {
    service.getAllAlbums$().subscribe((albums) => {
      expect(albums).toEqual(MOCK_ALBUM_LIST);
      expect(storageService.albums).toEqual(MOCK_ALBUM_LIST);
    });

    const req = http.expectOne('https://jsonplaceholder.typicode.com/albums');
    req.flush(MOCK_ALBUM_LIST);
  });

  it('should fetch album details by ID', () => {
    const albumId = 1;

    service.getAlbumDetails$(albumId).subscribe((post) => {
      expect(post).toEqual(MOCK_ALBUM);
    });

    const req = http.expectOne(`https://jsonplaceholder.typicode.com/posts/${albumId}`);
    req.flush(MOCK_ALBUM);
  });

  it('should fetch all photos and update storage', () => {
    service.getAllPhotos$().subscribe((photos) => {
      expect(photos).toEqual(MOCK_PHOTO_LIST);
      expect(storageService.photos).toEqual(MOCK_PHOTO_LIST);
    });

    const req = http.expectOne('https://jsonplaceholder.typicode.com/photos');
    req.flush(MOCK_PHOTO_LIST);
  });

  it('should fetch photo details by ID', () => {
    const photoId = 1;

    service.getPhotoDetails$(photoId).subscribe((photo) => {
      expect(photo).toEqual(MOCK_PHOTO);
    });

    const req = http.expectOne(`https://jsonplaceholder.typicode.com/photos/${photoId}`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_PHOTO);
  });
});
