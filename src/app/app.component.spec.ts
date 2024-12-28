import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { MOCK_ALBUM_LIST } from './core/sample-response/album';
import { MOCK_PHOTO_LIST } from './core/sample-response/photos';
import { MOCK_POST_LIST } from './core/sample-response/post';
import { ApiService } from './core/services/api/api.service';
import { StorageService } from './core/services/storage/storage.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: Router;

  beforeEach(async () => {
    storageService = jasmine.createSpyObj('StorageService', ['retrieveBookmarkedPosts']);
    apiService = jasmine.createSpyObj('ApiService', [
      'getAllPosts$',
      'getAllAlbums$',
      'getAllPhotos$',
      'loadUsers',
    ]);

    apiService.getAllPosts$.and.returnValue(of(MOCK_POST_LIST));
    apiService.getAllAlbums$.and.returnValue(of(MOCK_ALBUM_LIST));
    apiService.getAllPhotos$.and.returnValue(of(MOCK_PHOTO_LIST));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ApiService, useValue: apiService },
        { provide: StorageService, useValue: storageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should initialize with loading true', () => {
    expect(component.loading).toBeTrue();
  });

  it('should load all data and update storage on successful API calls', () => {
    fixture.detectChanges();

    expect(apiService.getAllPosts$).toHaveBeenCalled();
    expect(apiService.getAllAlbums$).toHaveBeenCalled();
    expect(apiService.getAllPhotos$).toHaveBeenCalled();
    expect(component.loading).toBeFalse();

    expect(storageService.posts).toEqual(MOCK_POST_LIST);
    expect(storageService.albums).toEqual(MOCK_ALBUM_LIST);
    expect(storageService.photos).toEqual(MOCK_PHOTO_LIST);
  });

  it('should navigate to error page when API calls fail', () => {
    apiService.getAllPosts$.and.returnValue(throwError(() => new Error('API Error')));

    const routerSpy = spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['error']);
  });

  it('should call loadUsers and retrieveBookmarkedPosts on init', () => {
    fixture.detectChanges();

    expect(apiService.loadUsers).toHaveBeenCalled();
    expect(storageService.retrieveBookmarkedPosts).toHaveBeenCalled();
  });
});
