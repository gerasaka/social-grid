import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TSortQuery } from '../../components/filter/filter.types';
import { PhotoCardComponent } from '../../components/photo-card/photo-card.component';
import { IPhoto } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { ListContainerComponent } from '../../layouts/list-container/list-container.component';
import { TPageFilter, TPageState } from '../../layouts/list-container/list-container.type';
import { ArrowLeftIcon } from '../../shared/icons/arrow-left.component';

@Component({
  selector: 'album-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ListContainerComponent,
    PhotoCardComponent,
    ArrowLeftIcon,
  ],
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.scss',
})
export class AlbumDetailsPage implements OnInit {
  private storageService = inject(StorageService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

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

  albumId!: number;
  albumPhotos: IPhoto[] = [];
  filteredPhotos: IPhoto[] = [];
  photos: IPhoto[] = [];

  ngOnInit(): void {
    this.albumId = Number(this.activeRoute.snapshot.params['id']);
    this.setAlbumPhotos();

    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.pagefilter.search = search || '';
        this.pagefilter.sort = sort || 'DEFAULT';
        this.pageState.currPage = page || 1;

        this.loadPhotos(search, sort);
      },
    });
  }

  setAlbumPhotos() {
    this.albumPhotos = this.storageService.photos.filter(
      (photo) => photo.albumId === Number(this.albumId),
    );
  }

  loadPhotos(query?: string, sort?: string) {
    this.filteredPhotos = [...this.albumPhotos];

    if (query) this.searchPhotos(query);
    if (sort) this.sortPhotos(sort as TSortQuery);

    const start = (this.pageState.currPage - 1) * this.pageState.pageSize;
    const end = start + this.pageState.pageSize;

    this.photos = this.filteredPhotos.slice(start, end);
    this.pageState.totalContent = this.filteredPhotos.length;
    this.pageState.loading = false;
  }

  searchPhotos(query: string) {
    this.filteredPhotos = this.albumPhotos.filter((photo) => photo.title.includes(query));
  }

  sortPhotos(sort: TSortQuery) {
    switch (sort) {
      case 'ASC':
        this.filteredPhotos = this.filteredPhotos.sort((a, b) =>
          a.title[0].localeCompare(b.title[0]),
        );

        break;
      case 'DESC':
        this.filteredPhotos = this.filteredPhotos.sort((a, b) =>
          b.title[0].localeCompare(a.title[0]),
        );

        break;
      default:
        this.filteredPhotos = this.filteredPhotos.sort((a, b) => a.id - b.id);
        break;
    }
  }

  back() {
    this.router.navigate(['albums']);
  }
}
