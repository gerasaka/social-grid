import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TSortQuery } from '../../components/filter/filter.types';
import { IAlbum } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { ListContainerComponent } from '../../layouts/list-container/list-container.component';
import { TPageFilter, TPageState } from '../../layouts/list-container/list-container.type';
import { CircleUserIcon } from '../../shared/icons/circle-user.component';

@Component({
  selector: 'albums',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ListContainerComponent, CircleUserIcon],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsPage implements OnInit {
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

  filteredAlbums: IAlbum[] = [];
  albums: IAlbum[] = [];

  ngOnInit(): void {
    this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: ({ search, sort, page }) => {
        this.pagefilter.search = search || '';
        this.pagefilter.sort = sort || 'DEFAULT';
        this.pageState.currPage = page || 1;

        this.loadAlbums(search, sort);
      },
    });
  }

  loadAlbums(query?: string, sort?: string) {
    this.filteredAlbums = [...this.storageService.albums];

    if (query) this.searchAlbums(query);
    if (sort) this.sortAlbums(sort as TSortQuery);

    const start = (this.pageState.currPage - 1) * this.pageState.pageSize;
    const end = start + this.pageState.pageSize;

    this.albums = this.filteredAlbums.slice(start, end);
    this.pageState.totalContent = this.filteredAlbums.length;
    this.pageState.loading = false;
  }

  getAlbumAuthor(id: number) {
    const { name } = this.storageService.users()[id - 1];
    return name;
  }

  searchAlbums(query: string) {
    this.filteredAlbums = this.storageService.albums.filter((album) => album.title.includes(query));
  }

  sortAlbums(sort: TSortQuery) {
    switch (sort) {
      case 'ASC':
        this.filteredAlbums = this.filteredAlbums.sort((a, b) =>
          a.title[0].localeCompare(b.title[0]),
        );
        break;
      case 'DESC':
        this.filteredAlbums = this.filteredAlbums.sort((a, b) =>
          b.title[0].localeCompare(a.title[0]),
        );
        break;
      default:
        this.filteredAlbums = this.filteredAlbums.sort((a, b) => a.id - b.id);
        break;
    }
  }
}
