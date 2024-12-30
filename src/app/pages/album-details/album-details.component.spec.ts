import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MOCK_PHOTO_LIST } from '../../core/sample-response/photos';
import { IPhoto } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { AlbumDetailsPage } from './album-details.component';

fdescribe('AlbumDetailsComponent', () => {
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

  it('should filter photos based on search query', () => {
    component.loadPhotos('qui', undefined);

    expect(component.filteredPhotos.every((photo) => photo.title.includes('qui'))).toBeTrue();
  });

  it('should sort photos in ascending order', () => {
    const sortCallback = (a: IPhoto, b: IPhoto) => a.title[0].localeCompare(b.title[0]);

    component.loadPhotos(undefined, 'ASC');

    expect(component.filteredPhotos).toEqual(component.filteredPhotos.sort(sortCallback));
  });

  it('should sort albums in descending order', () => {
    const sortCallback = (a: IPhoto, b: IPhoto) => b.title[0].localeCompare(a.title[0]);

    component.loadPhotos(undefined, 'DESC');

    expect(component.filteredPhotos).toEqual(component.filteredPhotos.sort(sortCallback));
  });

  it('should sort photos in default order', () => {
    component.loadPhotos();
    component.sortPhotos('DEFAULT');

    expect(component.filteredPhotos).toEqual(
      MOCK_PHOTO_LIST.filter((photo) => photo.albumId === component.albumId),
    );
  });

  it('should paginate albums correctly', () => {
    const page = 1;
    const expectedPhotos = MOCK_PHOTO_LIST.filter((photo) => photo.albumId === component.albumId);

    component.pageState.currPage = page;
    component.pageState.pageSize = 10;
    component.loadPhotos();

    expect(component.photos).toEqual(expectedPhotos);
    expect(component.pageState.totalContent).toBe(expectedPhotos.length);
  });

  it('should navigate back on calling back method', () => {
    const routerSpy = spyOn(router, 'navigate');

    component.back();

    expect(routerSpy).toHaveBeenCalledWith(['albums']);
  });
});
