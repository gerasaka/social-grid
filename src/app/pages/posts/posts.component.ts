import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TSortQuery } from '../../components/filter/filter.types';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { IPost } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { ListContainerComponent } from '../../layouts/list-container/list-container.component';
import { TPageFilter, TPageState } from '../../layouts/list-container/list-container.type';

@Component({
  selector: 'posts',
  imports: [CommonModule, ReactiveFormsModule, PostCardComponent, ListContainerComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsPages implements OnInit {
  private storageService = inject(StorageService);
  private activeRoute = inject(ActivatedRoute);

  readonly #destroyRef = inject(DestroyRef);

  pageState: TPageState = {
    loading: true,
    currPage: 1,
    pageSize: 12,
    totalContent: 0,
  };

  pagefilter: TPageFilter = {
    search: '',
    sort: 'DEFAULT',
  };

  filteredPosts: IPost[] = [];
  posts: IPost[] = [];

  ngOnInit() {
    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.pagefilter.search = search || '';
        this.pagefilter.sort = sort || 'DEFAULT';
        this.pageState.currPage = page || 1;

        this.loadPosts(search, sort);
      },
    });
  }

  loadPosts(query?: string, sort?: string) {
    this.filteredPosts = [...this.storageService.posts];

    if (query) this.searchPosts(query);
    if (sort) this.sortPosts(sort as TSortQuery);

    const start = (this.pageState.currPage - 1) * this.pageState.pageSize;
    const end = start + this.pageState.pageSize;

    this.posts = this.filteredPosts.slice(start, end);
    this.pageState.totalContent = this.filteredPosts.length;
    this.pageState.loading = false;
  }

  searchPosts(query: string) {
    this.filteredPosts = this.storageService.posts.filter((post) => post.title.includes(query));
  }

  sortPosts(sort: TSortQuery) {
    switch (sort) {
      case 'ASC':
        this.filteredPosts = this.filteredPosts.sort((a, b) => {
          return a.title[0].localeCompare(b.title[0]);
        });
        break;
      case 'DESC':
        this.filteredPosts = this.filteredPosts.sort((a, b) => {
          return b.title[0].localeCompare(a.title[0]);
        });
        break;
      default:
        this.filteredPosts = this.filteredPosts.sort((a, b) => a.id - b.id);
        break;
    }
  }
}
