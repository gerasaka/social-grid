import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { MOCK_PHOTO_LIST } from '../../core/sample-response/photos';
import { MOCK_POST_LIST } from '../../core/sample-response/post';
import { MOCK_USER_LIST } from '../../core/sample-response/user';
import { StorageService } from '../../core/services/storage/storage.service';
import { DashboardPage } from './dashboard.component';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['posts', 'photos', 'users']);

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StorageService, useValue: storageService }],
    });

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
  });

  it('should initialize recentPosts and newPhotos on ngOnInit', () => {
    storageService.posts = MOCK_POST_LIST;
    storageService.photos = MOCK_PHOTO_LIST;
    storageService.users.and.returnValue(MOCK_USER_LIST);

    fixture.detectChanges();

    expect(component.recentPosts).toEqual(MOCK_POST_LIST.slice(0, 5));
    expect(component.newPhotos).toEqual(MOCK_PHOTO_LIST.slice(0, 10));
  });

  it('should get post author name by id', () => {
    storageService.users.and.returnValue(MOCK_USER_LIST);

    const authorName = component.getPostAuthor(0);

    expect(authorName).toBe(MOCK_USER_LIST[0].name);
  });
});
