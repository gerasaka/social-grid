import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MOCK_POST } from '../../core/sample-response/post';
import { MOCK_USER } from '../../core/sample-response/user';
import { ApiService } from '../../core/services/api/api.service';
import { StorageService } from '../../core/services/storage/storage.service';
import { PostDetailsPage } from './post-details.component';

describe('PostDetailsPage', () => {
  let component: PostDetailsPage;
  let fixture: ComponentFixture<PostDetailsPage>;
  let apiService: jasmine.SpyObj<ApiService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['getPostDetails$']);
    storageService = jasmine.createSpyObj('StorageService', [
      'users',
      'bookmarkedPosts',
      'addBookmark',
      'removeBookmark',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiService },
        { provide: StorageService, useValue: storageService },
      ],
    });

    fixture = TestBed.createComponent(PostDetailsPage);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  it('should fetch post details and update state', () => {
    activatedRoute.snapshot.params = { id: 1 };

    apiService.getPostDetails$.and.returnValue(of(MOCK_POST));
    storageService.users.and.returnValue([MOCK_USER]);

    fixture.detectChanges();

    expect(apiService.getPostDetails$).toHaveBeenCalledWith(1);
    expect(component.postDetails).toEqual(MOCK_POST);
    expect(component.postAuthor).toEqual(MOCK_USER);
  });

  it('should navigate to error page on API failure', () => {
    apiService.getPostDetails$.and.returnValue(throwError(() => new Error('API Error')));

    const routerSpy = spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['error']);
  });

  it('should bookmark a post', () => {
    component.bookmarkPost(MOCK_POST);

    expect(storageService.addBookmark).toHaveBeenCalledWith(MOCK_POST);
  });

  it('should remove a bookmark', () => {
    component.removeBookmark(1);

    expect(storageService.removeBookmark).toHaveBeenCalledWith(1);
  });

  it('should navigate back on calling back method', () => {
    spyOn(history, 'back');

    component.back();

    expect(history.back).toHaveBeenCalled();
  });
});
