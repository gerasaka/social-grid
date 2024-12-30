import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MOCK_PHOTO_LIST } from '../../core/sample-response/photos';
import { IPhoto } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { PhotosPage } from './photos.component';

describe('PhotosPage', () => {
  let component: PhotosPage;
  let fixture: ComponentFixture<PhotosPage>;
  let storageService: jasmine.SpyObj<StorageService>;
  let activeRoute: ActivatedRoute;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['photos']);
    storageService.photos = MOCK_PHOTO_LIST;

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StorageService, useValue: storageService }],
    });

    fixture = TestBed.createComponent(PhotosPage);
    component = fixture.componentInstance;
    activeRoute = TestBed.inject(ActivatedRoute);
  });

  it('should set page filter and state from query params', () => {
    spyOn(component, 'loadPhotos');
    activeRoute.queryParams = of({ search: 'test', sort: 'DESC', page: 2 });

    fixture.detectChanges();

    expect(component.pagefilter.search).toBe('test');
    expect(component.pagefilter.sort).toBe('DESC');
    expect(component.pageState.currPage).toBe(2);
    expect(component.loadPhotos).toHaveBeenCalledWith('test', 'DESC');
  });

  it('should handle default values for missing queryParams', () => {
    activeRoute.queryParams = of({});

    component.ngOnInit();

    expect(component.pagefilter.search).toBe('');
    expect(component.pagefilter.sort).toBe('DEFAULT');
    expect(component.pageState.currPage).toBe(1);
  });

  it('should filter posts based on search query', () => {
    component.loadPhotos('non', undefined);

    expect(component.filteredPhotos.every((photo) => photo.title.includes('non'))).toBeTrue();
  });

  it('should sort posts in ascending order', () => {
    const sortCallback = (a: IPhoto, b: IPhoto) => a.title[0].localeCompare(b.title[0]);

    component.loadPhotos(undefined, 'ASC');

    expect(component.filteredPhotos).toEqual(component.filteredPhotos.sort(sortCallback));
  });

  it('should sort posts in descending order', () => {
    const sortCallback = (a: IPhoto, b: IPhoto) => b.title[0].localeCompare(a.title[0]);

    component.loadPhotos(undefined, 'DESC');

    expect(component.filteredPhotos).toEqual(component.filteredPhotos.sort(sortCallback));
  });

  it('should sort albums in default order', () => {
    component.loadPhotos();
    component.sortPhotos('DEFAULT');

    expect(component.filteredPhotos).toEqual(MOCK_PHOTO_LIST);
  });

  it('should paginate posts correctly', () => {
    const page = 2;
    component.pageState.currPage = page;
    component.pageState.pageSize = 3;

    component.loadPhotos();

    const start = (page - 1) * component.pageState.pageSize;
    const end = start + component.pageState.pageSize;

    expect(component.photos).toEqual(MOCK_PHOTO_LIST.slice(start, end));
    expect(component.pageState.totalContent).toBe(MOCK_PHOTO_LIST.length);
  });
});
