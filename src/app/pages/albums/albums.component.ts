import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api/api.service';
import { StorageService } from '../../core/services/storage/storage.service';

@Component({
  selector: 'albums',
  imports: [CommonModule, ReactiveFormsModule, NgbPagination],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsPage implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);

  private destroy$ = new Subject<void>();

  pageState: 'LOADING' | 'COMPLETE' | 'ERROR' = 'LOADING';
  _currPage = signal(1);
  pageSize = 10;
  totalAlbum = 0;

  filteredAlbums = signal(this.storageService.albums);
  albums = computed(() => {
    const start = (this._currPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredAlbums().slice(start, end);
  });
  query = new FormControl('');
  sort = new FormControl<'ASC' | 'DESC' | 'DEFAULT'>('DEFAULT');

  ngOnInit(): void {
    this.loadAlbums();
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

  loadAlbums() {
    if (this.storageService.albums.length === 0) {
      this.apiService.getAllAlbums().subscribe({
        next: (res) => {
          this.totalAlbum = res.length;
          this.filteredAlbums.set(res);

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
      .subscribe({ next: (query) => this.searchAlbums(query) });

    this.sort.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (val) => this.sortAlbums(val!),
    });
  }

  searchAlbums(query: string | null) {
    if (query) {
      this.filteredAlbums.set(
        this.storageService.albums.filter((album) => album.title.includes(query)),
      );
    } else this.filteredAlbums.set(this.storageService.albums);

    this.sort.setValue('DEFAULT', { emitEvent: false });
  }

  sortAlbums(sort: 'ASC' | 'DESC' | 'DEFAULT') {
    switch (sort) {
      case 'ASC':
        this.filteredAlbums.set([
          ...this.filteredAlbums().sort((a, b) => a.title[0].localeCompare(b.title[0])),
        ]);
        break;
      case 'DESC':
        this.filteredAlbums.set([
          ...this.filteredAlbums().sort((a, b) => b.title[0].localeCompare(a.title[0])),
        ]);
        break;
      case 'DEFAULT':
        this.filteredAlbums.set([...this.filteredAlbums().sort((a, b) => a.id - b.id)]);
        break;
    }
  }
}
