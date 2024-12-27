import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ListLoadingComponent } from '../../components/list-loading.component';
import { IPhoto } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { ArrowLeftIcon } from '../../shared/icons/arrow-left.component';
import { SearchIcon } from '../../shared/icons/search.component';
import { SortIcon } from '../../shared/icons/sort.component';

@Component({
  selector: 'album-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ListLoadingComponent,
    ArrowLeftIcon,
    SearchIcon,
    SortIcon,
    NgbPagination,
  ],
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.scss',
})
export class AlbumDetailsPage implements OnInit {
  private storageService = inject(StorageService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  readonly #destroyRef = inject(DestroyRef);

  albumId!: number;
  albumPhotos: IPhoto[] = [];

  loading = true;
  _currPage = 1;
  pageSize = 10;
  totalPhoto = 0;

  searchQuery = new FormControl('');
  sortQuery = new FormControl<'ASC' | 'DESC' | 'DEFAULT'>('DEFAULT');
  filteredPhotos = signal<IPhoto[]>([]);
  photos = computed(() => {
    const start = (this._currPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPhotos().slice(start, end);
  });

  ngOnInit(): void {
    this.albumId = Number(this.activeRoute.snapshot.params['id']);
    this.setAlbumPhotos();

    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.searchQuery.setValue(search || '');
        this.sortQuery.setValue(sort || 'DEFAULT');
        this._currPage = page || 1;

        this.loadPhotos(search, sort);
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

  setAlbumPhotos() {
    this.albumPhotos = this.storageService.photos.filter(
      (photo) => photo.albumId === Number(this.albumId),
    );
  }

  loadPhotos(query?: string, sort?: string) {
    this.filteredPhotos.set([...this.albumPhotos]);

    if (query) this.searchPhotos(query);
    if (sort) this.sortPhotos(sort as 'ASC' | 'DESC' | 'DEFAULT');

    this.totalPhoto = this.filteredPhotos().length;
    this.loading = false;

    this.initListener();
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
    this.router.navigate(['albums', this.albumId], {
      queryParams: {
        search: this.searchQuery.value || undefined,
        sort: this.sortQuery.value === 'DEFAULT' ? undefined : this.sortQuery.value,
        page: this.currPage,
      },
    });
  }

  searchPhotos(query: string) {
    this.filteredPhotos.set(this.albumPhotos.filter((photo) => photo.title.includes(query)));
  }

  sortPhotos(sort: 'ASC' | 'DESC' | 'DEFAULT') {
    switch (sort) {
      case 'ASC':
        this.filteredPhotos.update((photo) =>
          photo.sort((a, b) => a.title[0].localeCompare(b.title[0])),
        );
        break;
      case 'DESC':
        this.filteredPhotos.update((photo) =>
          photo.sort((a, b) => b.title[0].localeCompare(a.title[0])),
        );
        break;
      default:
        this.filteredPhotos.update((photo) => photo.sort((a, b) => a.id - b.id));
        break;
    }
  }

  back() {
    this.router.navigate(['albums']);
  }
}
