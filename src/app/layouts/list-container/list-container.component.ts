import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from '../../components/filter/filter.component';
import { TFilter } from '../../components/filter/filter.types';
import { ListLoadingComponent } from '../../components/list-loading.component';
import { TPageFilter, TPageState } from './list-container.type';

@Component({
  selector: 'list-container',
  imports: [CommonModule, ListLoadingComponent, FilterComponent, NgbPagination],
  templateUrl: './list-container.component.html',
  styleUrl: './list-container.component.scss',
})
export class ListContainerComponent implements OnInit {
  private router = inject(Router);

  _currPage = 1;

  pageState = input.required<TPageState>();
  pageFilter = input.required<TPageFilter>();

  ngOnInit(): void {
    this._currPage = this.pageState().currPage;
  }

  get currPage() {
    return this._currPage;
  }

  set currPage(page: number) {
    this._currPage = page;
    this.applyFilters({ search: this.pageFilter().search, sort: this.pageFilter().sort });
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
}
