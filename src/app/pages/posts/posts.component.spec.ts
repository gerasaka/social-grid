import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MOCK_POST_LIST } from '../../core/sample-response/post';
import { StorageService } from '../../core/services/storage/storage.service';
import { PostsPages } from './posts.component';

describe('PostsPage', () => {
  let component: PostsPages;
  let fixture: ComponentFixture<PostsPages>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: Router;
  let activeRoute: ActivatedRoute;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['posts']);
    storageService.posts = MOCK_POST_LIST;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: StorageService, useValue: storageService },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
      ],
    });

    fixture = TestBed.createComponent(PostsPages);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activeRoute = TestBed.inject(ActivatedRoute);
  });

  // it('should subscribe to route queryParams and update filters', () => {
  //   spyOn(component, 'loadPosts');

  //   activeRoute.queryParams = of({
  //     search: 'Example',
  //     sort: 'DESC',
  //     page: 2,
  //   });

  //   component.ngOnInit();

  //   expect(component.search).toBe('Example');
  //   expect(component.sort).toBe('DESC');
  //   // expect(component.currPage).toBe(2);
  //   expect(component.loadPosts).toHaveBeenCalledWith('Example', 'DESC');
  // });

  // it('should handle default values for missing queryParams', () => {
  //   activeRoute.queryParams = of({});

  //   component.ngOnInit();

  //   expect(component.search).toBe('');
  //   expect(component.sort).toBe('DEFAULT');
  //   expect(component._currPage).toBe(1);
  // });

  // it('should load posts and set filteredPosts correctly', () => {
  //   component.loadPosts();

  //   expect(component.filteredPosts()).toEqual(MOCK_POST_LIST);
  //   expect(component.totalPost).toBe(MOCK_POST_LIST.length);
  //   expect(component.loading).toBeFalse();
  // });

  // it('should search and sort albums with the given searchquery and sortquery ', () => {
  //   spyOn(component, 'searchPosts');
  //   spyOn(component, 'sortPosts');

  //   component.loadPosts('test', 'ASC');

  //   expect(component.searchPosts).toHaveBeenCalledWith('test');
  //   expect(component.sortPosts).toHaveBeenCalledWith('ASC');
  //   expect(component.loading).toBeFalse();
  // });

  // it('should apply filters and update queryParams', () => {
  //   const routerSpy = spyOn(router, 'navigate');
  //   const applyFiltersSpy = spyOn(component, 'applyFilters').and.callThrough();

  //   component.search = 'Test';
  //   component.sort = 'ASC';
  //   component.currPage = 2;

  //   component.applyFilters({ search: 'Test', sort: 'ASC' });

  //   expect(applyFiltersSpy).toHaveBeenCalledWith({ search: 'Test', sort: 'ASC' });
  //   expect(routerSpy).toHaveBeenCalledWith(['posts'], {
  //     queryParams: { search: 'Test', sort: 'ASC', page: 2 },
  //   });
  // });

  it('should reset filters if searchQuery and sortQuery is not given', () => {
    const routerSpy = spyOn(router, 'navigate');

    // component.applyFilters({ search: null, sort: 'DEFAULT' });

    expect(routerSpy).toHaveBeenCalledWith(['posts'], {
      queryParams: { search: undefined, sort: undefined, page: 1 },
    });
  });

  // it('should update posts signal based on filteredPosts', () => {
  //   component.filteredPosts.set(MOCK_POST_LIST);
  //   const derivedPosts = component.posts();

  //   expect(derivedPosts).toEqual(MOCK_POST_LIST.slice(0, component.pageSize));
  // });

  // it('should filter posts by search term', () => {
  //   component.searchPosts('ipsam');

  //   const filteredPosts = component.filteredPosts();

  //   expect(filteredPosts.length).toBeLessThan(MOCK_POST_LIST.length);
  //   expect(filteredPosts[0].title).toContain('ipsam');
  // });

  // it('should sort posts in ascending order', () => {
  //   component.loadPosts();
  //   component.sortPosts('ASC');

  //   const sortedPosts = component.filteredPosts();

  //   expect(sortedPosts[0].title.localeCompare(sortedPosts[1].title)).toBeLessThanOrEqual(0);
  // });

  // it('should sort posts in descending order', () => {
  //   component.loadPosts();
  //   component.sortPosts('DESC');

  //   const sortedPosts = component.filteredPosts();

  //   expect(sortedPosts[0].title.localeCompare(sortedPosts[1].title)).toBeGreaterThanOrEqual(0);
  // });

  // it('should sort posts in default order', () => {
  //   component.loadPosts();
  //   component.sortPosts('DEFAULT');

  //   const sortedPosts = component.filteredPosts();

  //   expect(sortedPosts).toEqual(MOCK_POST_LIST);
  // });
});
