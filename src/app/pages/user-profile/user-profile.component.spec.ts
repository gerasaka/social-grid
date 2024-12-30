import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MOCK_POST_LIST } from '../../core/sample-response/post';
import { MOCK_USER } from '../../core/sample-response/user';
import { ApiService } from '../../core/services/api/api.service';
import { StorageService } from '../../core/services/storage/storage.service';
import { UserProfilePage } from './user-profile.component';

describe('UserProfilePage', () => {
  let component: UserProfilePage;
  let fixture: ComponentFixture<UserProfilePage>;
  let apiService: jasmine.SpyObj<ApiService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: Router;
  let activeRoute: ActivatedRoute;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['getUserDetails$']);
    storageService = jasmine.createSpyObj('StorageService', ['posts']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiService },
        { provide: StorageService, useValue: storageService },
      ],
    });

    fixture = TestBed.createComponent(UserProfilePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activeRoute = TestBed.inject(ActivatedRoute);

    apiService.getUserDetails$.and.returnValue(of(MOCK_USER));
    storageService.posts = MOCK_POST_LIST;
  });

  it('should fetch user profile on ngOnInit', () => {
    activeRoute.snapshot.params = { id: 1 };

    const expectedUserPosts = MOCK_POST_LIST.filter((post) => post.userId === 1);

    fixture.detectChanges();

    expect(apiService.getUserDetails$).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(MOCK_USER);
    expect(component.posts).toEqual(expectedUserPosts);
    expect(component.loading).toBeFalse();
  });

  it('should navigate to error page on API error', () => {
    apiService.getUserDetails$.and.returnValue(throwError(() => new Error('API error')));

    const routerSpy = spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['error']);
  });

  it('should call history.back when back is called', () => {
    spyOn(history, 'back');

    component.back();

    expect(history.back).toHaveBeenCalled();
  });
});
