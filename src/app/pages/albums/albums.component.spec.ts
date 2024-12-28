import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MOCK_ALBUM_LIST } from '../../core/sample-response/album';
import { MOCK_USER_LIST } from '../../core/sample-response/user';
import { StorageService } from '../../core/services/storage/storage.service';
import { AlbumsPage } from './albums.component';

describe('AlbumsPage', () => {
  let component: AlbumsPage;
  let fixture: ComponentFixture<AlbumsPage>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['albums', 'users']);
    storageService.albums = MOCK_ALBUM_LIST;

    TestBed.configureTestingModule({
      imports: [AlbumsPage],
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
      ],
    });

    fixture = TestBed.createComponent(AlbumsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should subscribe to route queryParams and update filters', () => {
    spyOn(component, 'loadAlbums');

    activatedRoute.queryParams = of({
      search: 'Example',
      sort: 'DESC',
      page: 2,
    });

    component.ngOnInit();

    expect(component.search).toBe('Example');
    expect(component.sort).toBe('DESC');
    expect(component.currPage).toBe(2);
    expect(component.loadAlbums).toHaveBeenCalledWith('Example', 'DESC');
  });

  it('should load albums and set filteredAlbums correctly', () => {
    component.loadAlbums();

    expect(component.filteredAlbums()).toEqual(MOCK_ALBUM_LIST);
    expect(component.totalAlbum).toBe(MOCK_ALBUM_LIST.length);
    expect(component.loading).toBeFalse();
  });

  it('should return the name of the user based on ID', () => {
    storageService.users.and.returnValue(MOCK_USER_LIST);

    const authorName = component.getAlbumAuthor(2);

    expect(storageService.users).toHaveBeenCalled();
    expect(authorName).toBe('Ervin Howell');
  });

  it('should apply filters and update queryParams', () => {
    const applyFiltersSpy = spyOn(component, 'applyFilters').and.callThrough();
    component.search = 'quam';
    component.sort = 'ASC';
    component.currPage = 2;

    component.applyFilters({ search: 'quam', sort: 'ASC' });

    expect(applyFiltersSpy).toHaveBeenCalledWith({ search: 'quam', sort: 'ASC' });
    expect(router.navigate).toHaveBeenCalledWith(['albums'], {
      queryParams: {
        search: 'quam',
        sort: 'ASC',
        page: 2,
      },
    });
  });

  it('should update albums signal based on filteredAlbums', () => {
    component.filteredAlbums.set(MOCK_ALBUM_LIST);

    expect(component.albums()).toEqual(MOCK_ALBUM_LIST.slice(0, component.pageSize));
  });

  it('should filter albums by search term', () => {
    component.searchAlbums('quam');

    const filteredAlbums = component.filteredAlbums();

    expect(filteredAlbums.length).toBeLessThan(MOCK_ALBUM_LIST.length);
    expect(filteredAlbums[0].title).toContain('quam');
  });

  it('should sort albums in ascending order', () => {
    component.loadAlbums();
    component.sortAlbums('ASC');

    const sortedAlbums = component.filteredAlbums();

    expect(sortedAlbums[0].title.localeCompare(sortedAlbums[1].title)).toBeLessThanOrEqual(0);
  });

  it('should sort albums in descending order', () => {
    component.loadAlbums();
    component.sortAlbums('DESC');

    const sortedAlbums = component.filteredAlbums();

    expect(sortedAlbums[0].title.localeCompare(sortedAlbums[1].title)).toBeGreaterThanOrEqual(0);
  });

  it('should sort albums in default order', () => {
    component.loadAlbums();
    component.sortAlbums('DEFAULT');

    expect(component.filteredAlbums()).toEqual(MOCK_ALBUM_LIST);
  });
});
