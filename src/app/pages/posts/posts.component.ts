import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from '../../components/filter/filter.component';
import { TFilter, TSortQuery } from '../../components/filter/filter.types';
import { ListLoadingComponent } from '../../components/list-loading.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { IPost } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';

@Component({
  selector: 'posts',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ListLoadingComponent,
    FilterComponent,
    PostCardComponent,
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

  search = '';
  sort: TSortQuery = 'DEFAULT';

  filteredPosts = signal<IPost[]>([]);
  posts = computed(() => {
    const start = (this._currPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPosts().slice(start, end);
  });

  ngOnInit() {
    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.search = search || '';
        this.sort = sort || 'DEFAULT';
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
    this.applyFilters({ search: this.search, sort: this.sort });
  }

  loadPosts(query?: string, sort?: string) {
    this.filteredPosts.set([...this.storageService.posts]);

    if (query) this.searchPosts(query);
    if (sort) this.sortPosts(sort as TSortQuery);

    this.totalPost = this.filteredPosts().length;
    this.loading = false;
  }

  applyFilters({ search, sort }: TFilter) {
    this.router.navigate(['posts'], {
      queryParams: {
        search: search || undefined,
        sort: sort === 'DEFAULT' ? undefined : sort,
        page: this.currPage,
      },
    });
  }

  searchPosts(query: string) {
    this.filteredPosts.set(this.storageService.posts.filter((post) => post.title.includes(query)));
  }

  sortPosts(sort: TSortQuery) {
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
