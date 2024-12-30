import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MOCK_POST_LIST } from '../../core/sample-response/post';
import { IPost } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { PostsPages } from './posts.component';

describe('PostsPages', () => {
  let component: PostsPages;
  let fixture: ComponentFixture<PostsPages>;
  let storageService: jasmine.SpyObj<StorageService>;
  let activeRoute: ActivatedRoute;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['posts']);
    storageService.posts = MOCK_POST_LIST;

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StorageService, useValue: storageService }],
    });

    fixture = TestBed.createComponent(PostsPages);
    component = fixture.componentInstance;
    activeRoute = TestBed.inject(ActivatedRoute);
  });

  it('should set page filter and state from query params', () => {
    activeRoute.queryParams = of({ search: 'test', sort: 'DESC', page: 2 });

    fixture.detectChanges();

    expect(component.pagefilter.search).toBe('test');
    expect(component.pagefilter.sort).toBe('DESC');
    expect(component.pageState.currPage).toBe(2);
  });

  it('should handle default values for missing queryParams', () => {
    activeRoute.queryParams = of({});

    component.ngOnInit();

    expect(component.pagefilter.search).toBe('');
    expect(component.pagefilter.sort).toBe('DEFAULT');
    expect(component.pageState.currPage).toBe(1);
  });

  it('should filter posts based on search query', () => {
    component.loadPosts('qui', undefined);

    expect(component.filteredPosts.every((post) => post.title.includes('qui'))).toBeTrue();
  });

  it('should sort posts in ascending order', () => {
    const sortCallback = (a: IPost, b: IPost) => a.title[0].localeCompare(b.title[0]);

    component.loadPosts(undefined, 'ASC');

    expect(component.filteredPosts).toEqual(component.filteredPosts.sort(sortCallback));
  });

  it('should sort posts in descending order', () => {
    const sortCallback = (a: IPost, b: IPost) => b.title[0].localeCompare(a.title[0]);

    component.loadPosts(undefined, 'DESC');

    expect(component.filteredPosts).toEqual(component.filteredPosts.sort(sortCallback));
  });

  it('should sort albums in default order', () => {
    component.loadPosts();
    component.sortPosts('DEFAULT');

    expect(component.filteredPosts).toEqual(MOCK_POST_LIST);
  });

  it('should paginate posts correctly', () => {
    const page = 2;
    component.pageState.currPage = page;
    component.pageState.pageSize = 3;

    component.loadPosts();

    const start = (page - 1) * component.pageState.pageSize;
    const end = start + component.pageState.pageSize;

    expect(component.posts).toEqual(MOCK_POST_LIST.slice(start, end));
    expect(component.pageState.totalContent).toBe(MOCK_POST_LIST.length);
  });
});
