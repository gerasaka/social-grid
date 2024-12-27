import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchIcon } from '../../shared/icons/search.component';
import { SortIcon } from '../../shared/icons/sort.component';
import { TFilter, TSortQuery } from './filter.types';

@Component({
  selector: 'filter',
  imports: [CommonModule, ReactiveFormsModule, SortIcon, SearchIcon],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);

  search = input<string>();
  sort = input<TSortQuery>();
  applyFilters = output<TFilter>();

  searchQuery = new FormControl<string>('');
  sortQuery = new FormControl<TSortQuery>('DEFAULT');

  ngOnInit(): void {
    this.searchQuery.setValue(this.search() ?? '');
    this.sortQuery.setValue(this.sort() ?? 'DEFAULT');

    this.initListener();
  }

  initListener() {
    this.sortQuery.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => this.onSubmit(),
    });
  }

  onSubmit(e?: Event) {
    e?.preventDefault();

    this.applyFilters.emit({
      search: this.searchQuery.value,
      sort: this.sortQuery.value,
    });
  }
}
