import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MOCK_ALBUM_LIST } from '../../core/sample-response/album';
import { MOCK_USER_LIST } from '../../core/sample-response/user';
import { IAlbum } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { AlbumsPage } from './albums.component';

describe('AlbumsPage', () => {
  let component: AlbumsPage;
  let fixture: ComponentFixture<AlbumsPage>;
  let storageService: jasmine.SpyObj<StorageService>;
  let activeRoute: ActivatedRoute;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['albums', 'users']);
    storageService.albums = MOCK_ALBUM_LIST;

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StorageService, useValue: storageService }],
    });

    fixture = TestBed.createComponent(AlbumsPage);
    component = fixture.componentInstance;
    activeRoute = TestBed.inject(ActivatedRoute);
  });

  it('should set page filter and state from query params', () => {
    spyOn(component, 'loadAlbums');
    activeRoute.queryParams = of({ search: 'test', sort: 'DESC', page: 2 });

    fixture.detectChanges();

    expect(component.pagefilter.search).toBe('test');
    expect(component.pagefilter.sort).toBe('DESC');
    expect(component.pageState.currPage).toBe(2);
    expect(component.loadAlbums).toHaveBeenCalledWith('test', 'DESC');
  });

  it('should handle default values for missing queryParams', () => {
    activeRoute.queryParams = of({});

    component.ngOnInit();

    expect(component.pagefilter.search).toBe('');
    expect(component.pagefilter.sort).toBe('DEFAULT');
    expect(component.pageState.currPage).toBe(1);
  });

  it('should filter posts based on search query', () => {
    component.loadAlbums('quam', undefined);

    expect(component.filteredAlbums.every((album) => album.title.includes('quam'))).toBeTrue();
  });

  it('should sort posts in ascending order', () => {
    const sortCallback = (a: IAlbum, b: IAlbum) => a.title[0].localeCompare(b.title[0]);

    component.loadAlbums(undefined, 'ASC');

    expect(component.filteredAlbums).toEqual(component.filteredAlbums.sort(sortCallback));
  });

  it('should sort posts in descending order', () => {
    const sortCallback = (a: IAlbum, b: IAlbum) => b.title[0].localeCompare(a.title[0]);

    component.loadAlbums(undefined, 'DESC');

    expect(component.filteredAlbums).toEqual(component.filteredAlbums.sort(sortCallback));
  });

  it('should sort albums in default order', () => {
    component.loadAlbums();
    component.sortAlbums('DEFAULT');

    expect(component.filteredAlbums).toEqual(MOCK_ALBUM_LIST);
  });

  it('should return the name of the user based on ID', () => {
    storageService.users.and.returnValue(MOCK_USER_LIST);

    const authorName = component.getAlbumAuthor(2);

    expect(storageService.users).toHaveBeenCalled();
    expect(authorName).toBe('Ervin Howell');
  });

  it('should paginate posts correctly', () => {
    const page = 2;
    component.pageState.currPage = page;
    component.pageState.pageSize = 3;

    component.loadAlbums();

    const start = (page - 1) * component.pageState.pageSize;
    const end = start + component.pageState.pageSize;

    expect(component.albums).toEqual(MOCK_ALBUM_LIST.slice(start, end));
    expect(component.pageState.totalContent).toBe(MOCK_ALBUM_LIST.length);
  });
});
