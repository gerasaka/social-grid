import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from '../../components/filter/filter.component';
import { TFilter, TSortQuery } from '../../components/filter/filter.types';
import { ListLoadingComponent } from '../../components/list-loading.component';
import { IPost } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { BookmarkFillIcon } from '../../shared/icons/bookmark-fill.component';
import { BookmarkIcon } from '../../shared/icons/bookmark.component';
import { CircleUserIcon } from '../../shared/icons/circle-user.component';

@Component({
  selector: 'posts',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ListLoadingComponent,
    FilterComponent,
    BookmarkIcon,
    BookmarkFillIcon,
    CircleUserIcon,
    NgbPagination,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsPages implements OnInit {
  private storageService = inject(StorageService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  readonly #destroyRef = inject(DestroyRef);

  loading = true;
  _currPage = 1;
  pageSize = 12;
  totalPost = 0;

  searchQuery = '';
  sortQuery: TSortQuery = 'DEFAULT';

  filteredPosts = signal<IPost[]>([]);
  posts = computed(() => {
    const start = (this._currPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPosts().slice(start, end);
  });

  ngOnInit() {
    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.searchQuery = search || '';
        this.sortQuery = sort || 'DEFAULT';
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
    this.applyFilters({ searchQuery: this.searchQuery, sortQuery: this.sortQuery });
  }

  loadPosts(query?: string, sort?: string) {
    this.filteredPosts.set([...this.storageService.posts]);

    if (query) this.searchPosts(query);
    if (sort) this.sortPosts(sort as 'ASC' | 'DESC' | 'DEFAULT');

    this.totalPost = this.filteredPosts().length;
    this.loading = false;
  }

  getPostInfo(id: number) {
    const { name } = this.storageService.users()[id - 1];
    return { author: name, saved: false };
  }

  applyFilters({ searchQuery, sortQuery }: TFilter) {
    this.router.navigate(['posts'], {
      queryParams: {
        search: searchQuery || undefined,
        sort: sortQuery === 'DEFAULT' ? undefined : sortQuery,
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
