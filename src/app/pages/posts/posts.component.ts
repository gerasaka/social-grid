import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../core/services/api/api.service';
import { IPost } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { CircleUserIcon } from '../../shared/icons/circle-user.component';
import { FavouriteIcon } from '../../shared/icons/favourite.component';
import { SearchIcon } from '../../shared/icons/search.component';
import { SortIcon } from '../../shared/icons/sort.component';

@Component({
  selector: 'posts',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SearchIcon,
    SortIcon,
    FavouriteIcon,
    CircleUserIcon,
    NgbPagination,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsPages implements OnInit {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  readonly #destroyRef = inject(DestroyRef);

  pageState: 'LOADING' | 'COMPLETE' | 'ERROR' = 'LOADING';
  _currPage = 1;
  pageSize = 10;
  totalPost = 0;

  searchQuery = new FormControl('');
  sortQuery = new FormControl<'ASC' | 'DESC' | 'DEFAULT'>('DEFAULT');
  filteredPosts = signal<IPost[]>([]);
  posts = computed(() => {
    const start = (this._currPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPosts().slice(start, end);
  });

  ngOnInit() {
    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.searchQuery.setValue(search || '');
        this.sortQuery.setValue(sort || 'DEFAULT');
        this._currPage = page || 1;

        this.loadPosts(search, sort);
      },
    });
  }

  get currPage() {
    return this._currPage;
  }

  set currPage(page: number) {
    this._currPage = page;
    this.applyFilters();
  }

  loadPosts(query?: string, sort?: string) {
    const setContent = (posts: IPost[]) => {
      this.filteredPosts.set([...posts]);

      if (query) this.searchPosts(query);
      if (sort) this.sortPosts(sort as 'ASC' | 'DESC' | 'DEFAULT');

      this.totalPost = this.filteredPosts().length;
      this.pageState = 'COMPLETE';

      this.initListener();
    };

    if (this.storageService.posts.length === 0) {
      this.apiService.getAllPosts().subscribe({
        next: setContent,
        error: () => (this.pageState = 'ERROR'),
      });
    } else setContent(this.storageService.posts);
  }

  initListener() {
    this.sortQuery.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => this.applyFilters(),
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.applyFilters();
  }

  applyFilters() {
    this.router.navigate(['posts'], {
      queryParams: {
        search: this.searchQuery.value || undefined,
        sort: this.sortQuery.value === 'DEFAULT' ? undefined : this.sortQuery.value,
        page: this.currPage,
      },
    });
  }

  searchPosts(query: string) {
    this.filteredPosts.set(this.storageService.posts.filter((post) => post.title.includes(query)));
  }

  sortPosts(sort: 'ASC' | 'DESC' | 'DEFAULT') {
    switch (sort) {
      case 'ASC':
        this.filteredPosts.update((posts) =>
          posts.sort((a, b) => a.title[0].localeCompare(b.title[0])),
        );
        break;
      case 'DESC':
        this.filteredPosts.update((posts) =>
          posts.sort((a, b) => b.title[0].localeCompare(a.title[0])),
        );
        break;
      default:
        this.filteredPosts.update((posts) => posts.sort((a, b) => a.id - b.id));
        break;
    }
  }
}
