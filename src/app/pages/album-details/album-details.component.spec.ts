import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MOCK_PHOTO_LIST } from '../../core/sample-response/photos';
import { StorageService } from '../../core/services/storage/storage.service';
import { AlbumDetailsPage } from './album-details.component';

describe('AlbumDetailsComponent', () => {
  let component: AlbumDetailsPage;
  let fixture: ComponentFixture<AlbumDetailsPage>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: Router;
  let activeRoute: ActivatedRoute;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['albums', 'users']);
    storageService.photos = MOCK_PHOTO_LIST;

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StorageService, useValue: storageService }],
    });

    fixture = TestBed.createComponent(AlbumDetailsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activeRoute = TestBed.inject(ActivatedRoute);

    component.albumId = 1;
    component.setAlbumPhotos();
  });

  it('should set album photos based on albumId', () => {
    expect(component.albumPhotos).toEqual(MOCK_PHOTO_LIST.slice(0, 3));
  });

  it('should initialize and load photos on ngOnInit', () => {
    activeRoute.snapshot.params = { id: 1 };
    const mockQueryParams = { search: 'accusamus', sort: 'ASC', page: 2 };
    spyOn(activeRoute.queryParams, 'pipe').and.returnValue(of(mockQueryParams));

    fixture.detectChanges();

    expect(component.albumId).toEqual(1);
    expect(component.search).toEqual('accusamus');
    expect(component.sort).toEqual('ASC');
    expect(component.currPage).toEqual(2);
  });

  it('should handle default values for missing queryParams', () => {
    activeRoute.queryParams = of({});

    component.ngOnInit();

    expect(component.search).toBe('');
    expect(component.sort).toBe('DEFAULT');
    expect(component._currPage).toBe(1);
  });

  it('should load photos and set filteredPhotos correctly', () => {
    const expectedPhotoList = MOCK_PHOTO_LIST.slice(0, 3);
    component.loadPhotos();

    expect(component.filteredPhotos()).toEqual(expectedPhotoList);
    expect(component.totalPhoto).toBe(expectedPhotoList.length);
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
    expect(routerSpy).toHaveBeenCalledWith(['albums', 1], {
      queryParams: { search: 'non', sort: 'ASC', page: 2 },
    });
  });

  it('should update photos signal based on filteredPhotos', () => {
    const expectedPhotoList = MOCK_PHOTO_LIST.slice(0, 3);

    component.filteredPhotos.set(expectedPhotoList);

    expect(component.photos()).toEqual(expectedPhotoList);
  });

  it('should filter albums by search term', () => {
    const expectedPhotoList = MOCK_PHOTO_LIST.slice(0, 3);

    component.searchPhotos('accusamus');

    const filteredPhotos = component.filteredPhotos();

    expect(filteredPhotos.length).toBeLessThan(expectedPhotoList.length);
    expect(filteredPhotos[0].title).toContain('accusamus');
  });

  it('should sort albums in ascending order', () => {
    component.loadPhotos();
    component.sortPhotos('ASC');

    const sortedAlbums = component.filteredPhotos();

    expect(sortedAlbums[0].title.localeCompare(sortedAlbums[1].title)).toBeLessThanOrEqual(0);
  });

  it('should sort albums in descending order', () => {
    component.loadPhotos();
    component.sortPhotos('DESC');

    const sortedAlbums = component.filteredPhotos();

    expect(sortedAlbums[0].title.localeCompare(sortedAlbums[1].title)).toBeGreaterThanOrEqual(0);
  });

  it('should sort albums in default order', () => {
    component.loadPhotos();
    component.sortPhotos('DEFAULT');

    expect(component.filteredPhotos()).toEqual(component.albumPhotos);
  });

  it('should navigate back on calling back method', () => {
    const routerSpy = spyOn(router, 'navigate');

    component.back();

    expect(routerSpy).toHaveBeenCalledWith(['albums']);
  });
});
