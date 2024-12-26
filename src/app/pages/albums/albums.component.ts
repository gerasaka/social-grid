import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../core/services/api/api.service';
import { IAlbum } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { SearchIcon } from '../../shared/icons/search.component';
import { SortIcon } from '../../shared/icons/sort.component';

@Component({
  selector: 'albums',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SearchIcon, SortIcon, NgbPagination],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsPage implements OnInit {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  readonly #destroyRef = inject(DestroyRef);

  pageState: 'LOADING' | 'COMPLETE' | 'ERROR' = 'LOADING';
  _currPage = 1;
  pageSize = 10;
  totalAlbum = 0;

  searchQuery = new FormControl('');
  sortQuery = new FormControl<'ASC' | 'DESC' | 'DEFAULT'>('DEFAULT');
  filteredAlbums = signal<IAlbum[]>([]);
  albums = computed(() => {
    const start = (this._currPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredAlbums().slice(start, end);
  });

  ngOnInit(): void {
    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.searchQuery.setValue(search || '');
        this.sortQuery.setValue(sort || 'DEFAULT');
        this._currPage = page || 1;

        this.loadAlbums(search, sort);
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

  loadAlbums(query?: string, sort?: string) {
    const setContent = (albums: IAlbum[]) => {
      this.filteredAlbums.set([...albums]);

      if (query) this.searchAlbums(query);
      if (sort) this.sortAlbums(sort as 'ASC' | 'DESC' | 'DEFAULT');

      this.totalAlbum = this.filteredAlbums().length;
      this.pageState = 'COMPLETE';

      this.initListener();
    };

    if (this.storageService.albums.length === 0) {
      this.apiService.getAllAlbums$().subscribe({
        next: setContent,
        error: () => (this.pageState = 'ERROR'),
      });
    } else setContent(this.storageService.albums);
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
    this.router.navigate(['albums'], {
      queryParams: {
        search: this.searchQuery.value || undefined,
        sort: this.sortQuery.value === 'DEFAULT' ? undefined : this.sortQuery.value,
        page: this.currPage,
      },
    });
  }

  searchAlbums(query: string) {
    this.filteredAlbums.set(
      this.storageService.albums.filter((album) => album.title.includes(query)),
    );
  }

  sortAlbums(sort: 'ASC' | 'DESC' | 'DEFAULT') {
    switch (sort) {
      case 'ASC':
        this.filteredAlbums.update((albums) =>
          albums.sort((a, b) => a.title[0].localeCompare(b.title[0])),
        );
        break;
      case 'DESC':
        this.filteredAlbums.update((albums) =>
          albums.sort((a, b) => b.title[0].localeCompare(a.title[0])),
        );
        break;
      default:
        this.filteredAlbums.update((albums) => albums.sort((a, b) => a.id - b.id));
        break;
    }
  }
}
