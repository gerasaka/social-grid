import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api/api.service';
import { StorageService } from '../../core/services/storage/storage.service';

@Component({
  selector: 'photos',
  imports: [CommonModule, ReactiveFormsModule, NgbPagination],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
})
export class PhotosPage implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);

  private destroy$ = new Subject<void>();

  pageState: 'LOADING' | 'COMPLETE' | 'ERROR' = 'LOADING';
  _currPage = signal(1);
  pageSize = 50;
  totalPhoto = 0;

  filteredPhotos = signal(this.storageService.photos);
  photos = computed(() => {
    const start = (this._currPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPhotos().slice(start, end);
  });
  query = new FormControl('');
  sort = new FormControl<'ASC' | 'DESC' | 'DEFAULT'>('DEFAULT');

  ngOnInit(): void {
    this.loadPhotos();
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

  loadPhotos() {
    if (this.storageService.photos.length === 0) {
      this.apiService.getAllPhotos().subscribe({
        next: (res) => {
          this.totalPhoto = res.length;
          this.filteredPhotos.set(res);

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
      .subscribe({ next: (query) => this.searchPhotos(query) });

    this.sort.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (val) => this.sortPhotos(val!),
    });
  }

  searchPhotos(query: string | null) {
    if (query) {
      this.filteredPhotos.set(
        this.storageService.photos.filter((photo) => photo.title.includes(query)),
      );
    } else this.filteredPhotos.set(this.storageService.photos);

    this.sort.setValue('DEFAULT', { emitEvent: false });
  }

  sortPhotos(sort: 'ASC' | 'DESC' | 'DEFAULT') {
    switch (sort) {
      case 'ASC':
        this.filteredPhotos.set([
          ...this.filteredPhotos().sort((a, b) => a.title[0].localeCompare(b.title[0])),
        ]);
        break;
      case 'DESC':
        this.filteredPhotos.set([
          ...this.filteredPhotos().sort((a, b) => b.title[0].localeCompare(a.title[0])),
        ]);
        break;
      case 'DEFAULT':
        this.filteredPhotos.set([...this.filteredPhotos().sort((a, b) => a.id - b.id)]);
        break;
    }
  }
}
