import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api/api.service';
import { StorageService } from '../../core/services/storage/storage.service';

@Component({
  selector: 'posts',
  imports: [CommonModule, ReactiveFormsModule, NgbPagination],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsPages implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);

  private destroy$ = new Subject<void>();

  pageState: 'LOADING' | 'COMPLETE' | 'ERROR' = 'LOADING';
  _currPage = signal(1);
  pageSize = 10;
  totalPost = 0;

  filteredPosts = signal(this.storageService.posts);
  posts = computed(() => {
    console.log('computed');

    const start = (this._currPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPosts().slice(start, end);
  });
  query = new FormControl('');
  sort = new FormControl<'ASC' | 'DESC' | 'DEFAULT'>('DEFAULT');

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currPage() {
    return this._currPage();
  }

  set currPage(page: number) {
    this._currPage.set(page);
  }

  loadPosts() {
    if (this.storageService.posts.length === 0) {
      this.apiService.getAllPosts().subscribe({
        next: (res) => {
          this.totalPost = res.length;
          this.filteredPosts.set(res);

          this.initListener();
          this.pageState = 'COMPLETE';
        },
        error: () => (this.pageState = 'ERROR'),
      });
    } else {
      this.pageState = 'COMPLETE';
    }
  }

  initListener() {
    this.query.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe({ next: (query) => this.searchPosts(query) });

    this.sort.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (val) => this.sortPosts(val!),
    });
  }

  searchPosts(query: string | null) {
    if (query) {
      this.filteredPosts.set(
        this.storageService.posts.filter((post) => post.title.includes(query)),
      );
    } else this.filteredPosts.set(this.storageService.posts);

    this.sort.setValue('DEFAULT', { emitEvent: false });
  }

  sortPosts(sort: 'ASC' | 'DESC' | 'DEFAULT') {
    switch (sort) {
      case 'ASC':
        this.filteredPosts.set([
          ...this.filteredPosts().sort((a, b) => a.title[0].localeCompare(b.title[0])),
        ]);
        break;
      case 'DESC':
        this.filteredPosts.set([
          ...this.filteredPosts().sort((a, b) => b.title[0].localeCompare(a.title[0])),
        ]);
        break;
      case 'DEFAULT':
        // the update() not triggering signal computed value, need to investigate later
        // this.filteredPosts.update((posts) => posts.sort((a, b) => a.id - b.id));
        this.filteredPosts.set([...this.filteredPosts().sort((a, b) => a.id - b.id)]);
        break;
    }
  }
}
