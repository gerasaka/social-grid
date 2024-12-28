import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from '../../components/filter/filter.component';
import { TFilter, TSortQuery } from '../../components/filter/filter.types';
import { ListLoadingComponent } from '../../components/list-loading.component';
import { IAlbum } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { CircleUserIcon } from '../../shared/icons/circle-user.component';

@Component({
  selector: 'albums',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ListLoadingComponent,
    FilterComponent,
    CircleUserIcon,
    NgbPagination,
  ],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsPage implements OnInit {
  private storageService = inject(StorageService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  readonly #destroyRef = inject(DestroyRef);

  loading = true;
  _currPage = 1;
  pageSize = 10;
  totalAlbum = 0;

  search = '';
  sort: TSortQuery = 'DEFAULT';

  filteredAlbums = signal<IAlbum[]>([]);
  albums = computed(() => {
    const start = (this._currPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredAlbums().slice(start, end);
  });

  ngOnInit(): void {
    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.search = search || '';
        this.sort = sort || 'DEFAULT';
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
    this.applyFilters({ search: this.search, sort: this.sort });
  }

  loadAlbums(query?: string, sort?: string) {
    this.filteredAlbums.set([...this.storageService.albums]);

    if (query) this.searchAlbums(query);
    if (sort) this.sortAlbums(sort as TSortQuery);

    this.totalAlbum = this.filteredAlbums().length;
    this.loading = false;
  }

  getAlbumAuthor(id: number) {
    const { name } = this.storageService.users()[id - 1];
    return name;
  }

  applyFilters({ search, sort }: TFilter) {
    this.router.navigate(['albums'], {
      queryParams: {
        search: search || undefined,
        sort: sort === 'DEFAULT' ? undefined : sort,
        page: this.currPage,
      },
    });
  }

  searchAlbums(query: string) {
    this.filteredAlbums.set(
      this.storageService.albums.filter((album) => album.title.includes(query)),
    );
  }

  sortAlbums(sort: TSortQuery) {
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
