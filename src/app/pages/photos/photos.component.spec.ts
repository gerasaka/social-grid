import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MOCK_PHOTO_LIST } from '../../core/sample-response/photos';
import { StorageService } from '../../core/services/storage/storage.service';
import { PhotosPage } from './photos.component';

describe('PhotosPage', () => {
  let component: PhotosPage;
  let fixture: ComponentFixture<PhotosPage>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: Router;
  let activeRoute: ActivatedRoute;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['photos']);
    storageService.photos = MOCK_PHOTO_LIST;

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StorageService, useValue: storageService }],
    });

    fixture = TestBed.createComponent(PhotosPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activeRoute = TestBed.inject(ActivatedRoute);
  });

  it('should subscribe to route queryParams and update filters', () => {
    spyOn(component, 'loadPhotos');

    activeRoute.queryParams = of({ search: 'Example', sort: 'DESC', page: 2 });

    component.ngOnInit();

    expect(component.search).toBe('Example');
    expect(component.sort).toBe('DESC');
    expect(component.currPage).toBe(2);
    expect(component.loadPhotos).toHaveBeenCalledWith('Example', 'DESC');
  });

  it('should handle default values for missing queryParams', () => {
    activeRoute.queryParams = of({});

    component.ngOnInit();

    expect(component.search).toBe('');
    expect(component.sort).toBe('DEFAULT');
    expect(component._currPage).toBe(1);
  });

  it('should search and sort albums with the given searchquery and sortquery ', () => {
    spyOn(component, 'searchPhotos');
    spyOn(component, 'sortPhotos');

    component.loadPhotos('test', 'ASC');

    expect(component.searchPhotos).toHaveBeenCalledWith('test');
    expect(component.sortPhotos).toHaveBeenCalledWith('ASC');
    expect(component.loading).toBeFalse();
  });

  it('should load photos and set filteredPhotos correctly', () => {
    component.loadPhotos();

    expect(component.filteredPhotos()).toEqual(MOCK_PHOTO_LIST);
    expect(component.totalPhoto).toBe(MOCK_PHOTO_LIST.length);
    expect(component.loading).toBeFalse();
  });

  it('should apply filters and update queryParams', () => {
    const applyFiltersSpy = spyOn(component, 'applyFilters').and.callThrough();
    const routerSpy = spyOn(router, 'navigate');

    component.search = 'non';
    component.sort = 'ASC';
    component.currPage = 2;

    component.applyFilters({ search: 'non', sort: 'ASC' });

    expect(applyFiltersSpy).toHaveBeenCalledWith({ search: 'non', sort: 'ASC' });
    expect(routerSpy).toHaveBeenCalledWith(['photos'], {
      queryParams: { search: 'non', sort: 'ASC', page: 2 },
    });
  });

  it('should reset filters if searchQuery and sortQuery is not given', () => {
    const routerSpy = spyOn(router, 'navigate');

    component.applyFilters({ search: null, sort: 'DEFAULT' });

    expect(routerSpy).toHaveBeenCalledWith(['photos'], {
      queryParams: { search: undefined, sort: undefined, page: 1 },
    });
  });

  it('should update photos signal based on filteredPhotos', () => {
    component.filteredPhotos.set(MOCK_PHOTO_LIST);

    expect(component.photos()).toEqual(MOCK_PHOTO_LIST.slice(0, component.pageSize));
  });

  it('should filter photos by search term', () => {
    component.searchPhotos('non');

    const filteredPhotos = component.filteredPhotos();

    expect(filteredPhotos.length).toBeLessThan(MOCK_PHOTO_LIST.length);
    expect(filteredPhotos[0].title).toContain('non');
  });

  it('should sort photos in ascending order', () => {
    component.loadPhotos();
    component.sortPhotos('ASC');

    const sortedPhotos = component.filteredPhotos();

    expect(sortedPhotos[0].title.localeCompare(sortedPhotos[1].title)).toBeLessThanOrEqual(0);
  });

  it('should sort albums in descending order', () => {
    component.loadPhotos();
    component.sortPhotos('DESC');

    const sortedPhotos = component.filteredPhotos();

    expect(sortedPhotos[0].title.localeCompare(sortedPhotos[1].title)).toBeGreaterThanOrEqual(0);
  });

  it('should sort albums in default order', () => {
    component.loadPhotos();
    component.sortPhotos('DEFAULT');

    expect(component.filteredPhotos()).toEqual(MOCK_PHOTO_LIST);
  });
});
